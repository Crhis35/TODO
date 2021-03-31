import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';

import Dropzone from 'react-dropzone';

import { Form, Icon, List } from 'semantic-ui-react';
import { Formik } from 'formik';
import { toast } from 'react-toastify';

const IMAGE_UPLOADER = gql`
  mutation imageUploader($file: Upload!) {
    imageUploader(file: $file)
  }
`;

const CreateItem = () => {
  const [files, setFiles] = useState([]);
  const [uploadFile, { data }] = useMutation(IMAGE_UPLOADER);
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
    toast.success('Archivo cargado');
    try {
      uploadFile({ variables: { file: imageFile } });
    } catch (error) {
      console.log(error);
    }
    console.log(data);
    setFiles([...files, imageFile]);
  };
  return (
    <Formik>
      {(formik) => (
        <Form>
          <Form.Field>
            <Dropzone onDrop={(acceptedFiles) => onUploadFile(acceptedFiles)}>
              {({ getRootProps, getInputProps }) => (
                <div
                  className="ui center aligned tertiary blue inverted segment"
                  {...getRootProps()}
                >
                  <input {...getInputProps()} />
                  <Icon name="cloud upload" size="big" />
                  <div>Selecciona o arrastra videos o fotos del producto.</div>
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
        </Form>
      )}
    </Formik>
  );
};

export default CreateItem;
