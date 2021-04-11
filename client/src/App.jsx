import React, { Fragment } from 'react';
import { useQuery, gql, useSubscription } from '@apollo/client';
import { ToastContainer } from 'react-toastify';
import FormItem from './components/Item/Form';
import Card from './components/Card';

import {
  Container,
  Grid,
  Segment,
  Header,
  Button,
  Loader,
} from 'semantic-ui-react';

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
const ON_ITEM_CREATED = gql`
  subscription onItemCreated {
    onItemCreated {
      _id
      description
      image
      title
    }
  }
`;

const App = () => {
  const { data: subs } = useSubscription(ON_ITEM_CREATED);
  const { data, loading, fetchMore, error } = useQuery(LIST_ITEMS, {
    variables: {
      limit: 5,
      page: 1,
      search: '',
    },
  });
  if (loading) return <Loader />;
  console.log(subs);
  return (
    <Fragment>
      <Container>
        <Grid centered>
          <Grid.Row>
            <Grid.Column width={8}>
              <Segment>
                <Header>Create Note</Header>
                <FormItem />
              </Segment>
            </Grid.Column>
            <Grid.Column width={8}>
              <Card data={data} />
            </Grid.Column>
            {data.listItems.currentPage !== data.listItems.totalPages ? (
              <Button
                onClick={() => {
                  fetchMore({
                    variables: {
                      page: data.listItems.currentPage + 1,
                    },
                    updateQuery: (prev, { fetchMoreResult }) => {
                      if (!fetchMoreResult) return prev;
                      const newObect = {
                        currentPage: fetchMoreResult.listItems.currentPage,
                        items: [
                          ...prev.listItems.items,
                          ...fetchMoreResult.listItems.items,
                        ],
                        totalPages: fetchMoreResult.listItems.totalPages,
                      };
                      return Object.assign({}, prev, {
                        listItems: newObect,
                      });
                    },
                  });
                }}
              >
                More
              </Button>
            ) : null}
          </Grid.Row>
        </Grid>
      </Container>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        puaseOnVisibilityChange
        draggable
        pauseOnHover={false}
      />
    </Fragment>
  );
};

export default App;
