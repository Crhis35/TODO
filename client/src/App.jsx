import React, { Fragment } from 'react';
import { useQuery, gql } from '@apollo/client';
import { ToastContainer } from 'react-toastify';
import CreateItem from './component/Item/Item';

const LIST_ITEMS = gql`
  query listItems {
    listItems {
      items {
        _id
        title
        description
        createdAt
        updatedAt
      }
      currentPage
      totalPages
    }
  }
`;
const App = () => {
  return (
    <Fragment>
      <CreateItem />
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
