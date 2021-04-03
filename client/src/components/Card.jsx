import React from 'react';
import Swal from 'sweetalert2';
import { Image, Card, Button } from 'semantic-ui-react';
import { useQuery, gql, useMutation } from '@apollo/client';

const DELETE_ITEM = gql`
  mutation deleteItem($id: ID!) {
    deleteItem(id: $id)
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
const CardComponet = ({ data }) => {
  const [delteItem] = useMutation(DELETE_ITEM, {
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
            items: data.listItems.items.filter(
              (prod) => prod._id !== result.data.deleteItem
            ),
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
  const confirmDelete = (id) => {
    Swal.fire({
      title: 'Esta seguro de eliminarlo?',
      text: 'Esta accion no se podrá rehacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar',
      cancelButtonText: 'No, Cancelar',
    }).then(async (result) => {
      if (result.value) {
        try {
          delteItem({ variables: { id } });

          Swal.fire('Deleted', 'Card', 'success');
        } catch (error) {
          console.log(error);
        }
      }
    });
  };
  return (
    <Card.Group itemsPerRow={2}>
      {data.listItems.items.length > 0 ? (
        data.listItems.items.map(
          ({ title, image, createdAt, description, _id }) => (
            <Card key={_id}>
              <Image
                src={`http://localhost:4000${image?.split('images')[1]}`}
                wrapped
                ui={false}
              />
              <Card.Content>
                <Card.Header>{title}</Card.Header>
                <Card.Meta>
                  <span className="date">{createdAt}</span>
                </Card.Meta>
                <Card.Description>{description}</Card.Description>
                <Button color="red" onClick={() => confirmDelete(_id)}>
                  Delete
                </Button>
              </Card.Content>
            </Card>
          )
        )
      ) : (
        <h1>Theres no items yet</h1>
      )}
    </Card.Group>
  );
};

export default CardComponet;
