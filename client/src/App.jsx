import React from 'react';
import { useQuery, gql } from '@apollo/client';

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
  const { loading, error, data } = useQuery(LIST_ITEMS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  return data.listItems.items.map(({ title, description }) => (
    <div key={title}>
      <p>
        {title}: {description}
      </p>
      <img
        src="http://localhost:4000/image/xiaomi-1617131752053.jpeg"
        alt=""
        srcset=""
      />
    </div>
  ));
};

export default App;
