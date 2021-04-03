import React, { useState } from 'react';
import { useMutation, gql, useSubscription } from '@apollo/client';

import Dropzone from 'react-dropzone';

import {
  Form,
  Icon,
  List,
  Label,
  Input,
  TextArea,
  Button,
} from 'semantic-ui-react';
import { Formik } from 'formik';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

const IMAGE_UPLOADER = gql`
  mutation imageUploader($file: Upload!) {
    imageUploader(file: $file)
  }
`;
const LIST_ITEMS = gql`
  query listItems($limit: Int, $page: Int, $search: String, $sort: SortBy) {
    listItems(limit: $limit, page: $page, search: $search, sort: $sort) {
      items {
        _id
        title
        image
        description
        createdAt
        updatedAt
      }
      currentPage
      totalPages
    }
  }
`;
const CREATE_ITEM = gql`
  mutation createItem($input: ItemInput!) {
    createItem(input: $input) {
      _id
      title
      image
      description
      createdAt
    }
  }
`;

const FormItem = () => {
  const [files, setFiles] = useState(null);
  const [loading2, setLoading] = useState(false);
  const [image, setImage] = useState('');
  const [uploadFile] = useMutation(IMAGE_UPLOADER, {
    onCompleted({ imageUploader }) {
      setImage(imageUploader);
    },
  });
  const [createItem] = useMutation(CREATE_ITEM, {
    update(proxy, result) {
      let data = proxy.readQuery({
        query: LIST_ITEMS,
        variables: {
          limit: 5,
          page: 1,
          search: '',
        },
      });

      proxy.writeQuery({
        query: LIST_ITEMS,

        data: {
          ...data,
          listItems: {
            currentPage: data.listItems.currentPage,
            items: [result.data.createItem, ...data.listItems.items],
            totalPages: data.listItems.totalPages,
          },
        },
        variables: {
          limit: 5,
          page: 1,
          search: '',
        },
      });
    },
  });

  const onUploadFile = (target) => {
    const imageFile = target[0];

    if (!imageFile) {
      toast.error('Por favor seleccione un archivo.');
      return false;
    }

    if (!imageFile.name.match(/\.(?:jpe?g|png|mov|avi|wmv|flv|3gp|mp4|mpg)$/)) {
      toast.error('Por favor seleccione un archivo valido.');
      return false;
    }
    toast.success('File uploaded');
    uploadFile({ variables: { file: imageFile } });
  };
  return (
    <Formik
      initialValues={{
        title: '',
        description: '',
      }}
      validationSchema={Yup.object({
        title: Yup.string().required('You must provide a name'),
        description: Yup.string().required('You must provide a description'),
      })}
      onSubmit={async (values, { resetForm }) => {
        try {
          setLoading(true);
          const input = {
            ...values,
            image,
          };
          createItem({ variables: { input } });
          resetForm();
          toast.success('Note created!');
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      }}
    >
      {(formik) => (
        <Form onSubmit={formik.handleSubmit} loading={loading2}>
          <Form.Field
            id="form-input-control-error-email"
            error={
              formik.touched.title && formik.errors.title
                ? {
                    content: 'Please enter a valid email address',
                    pointing: 'below',
                  }
                : null
            }
          >
            <Label>Title</Label>
            <Input
              type="text"
              name="title"
              placeholder="Titulo*"
              icon="align justify"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </Form.Field>
          <Form.Field
            id="form-input-control-error-email"
            error={
              formik.touched.description && formik.errors.description
                ? {
                    content: 'Please enter a valid email address',
                    pointing: 'below',
                  }
                : null
            }
          >
            <Label>Description</Label>
            <TextArea
              type="text"
              name="description"
              placeholder="Description*"
              icon="align justify"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </Form.Field>
          <Form.Field>
            <Dropzone onDrop={(acceptedFiles) => onUploadFile(acceptedFiles)}>
              {({ getRootProps, getInputProps }) => (
                <div
                  className="ui center aligned tertiary blue inverted segment"
                  {...getRootProps()}
                >
                  <input {...getInputProps()} />
                  <Icon name="cloud upload" size="big" />
                  <div>Drag one or more files to this Drop Zone</div>
                </div>
              )}
            </Dropzone>
            {files && (
              <List divided verticalAlign="middle">
                {files.map(({ name }, i) => (
                  <List.Item key={i}>
                    <List.Icon name="file" />
                    <List.Content>
                      {name}
                      <Icon
                        link
                        color="red"
                        name="remove"
                        onClick={() => {
                          setFiles(files.filter((item) => item.name !== name));
                        }}
                      />
                    </List.Content>
                  </List.Item>
                ))}
              </List>
            )}
          </Form.Field>
          <Button color="green" type="submit" loading={loading2}>
            Crear
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default FormItem;
