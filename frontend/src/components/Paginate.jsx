// import { Pagination } from 'react-bootstrap';
// import { LinkContainer } from 'react-router-bootstrap';

// const Paginate = ({ pages, page, isAdmin = false, keyword = '' }) => {
//   return (
//     pages > 1 && (
//       <Pagination>
//         {[...Array(pages).keys()].map((x) => (
//           <LinkContainer
//             key={x + 1}
//             to={
//               !isAdmin
//                 ? keyword
//                   ? `/search/${keyword}/page/${x + 1}`
//                   : `/page/${x + 1}`
//                 : `/admin/productlist/${x + 1}`
//             }
//           >
//             <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
//           </LinkContainer>
//         ))}
//       </Pagination>
//     )
//   );
// };

// export default Paginate;
import React from 'react';
import { Pagination } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const Paginate = ({ pages, page, isAdmin = false, keyword = '', latitude = '', longitude = '', radius = '' }) => {
  return (
    pages > 1 && (
      <Pagination>
        {[...Array(pages).keys()].map((x) => (
          <LinkContainer
            key={x + 1}
            to={
              !isAdmin
                ? keyword
                  ? `/search?latitude=${latitude}&longitude=${longitude}&radius=${radius}`
                  : `/page/${x + 1}?latitude=${latitude}&longitude=${longitude}&radius=${radius}`
                : `/admin/productlist/${x + 1}`
            }
          >
            <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
          </LinkContainer>
        ))}
      </Pagination>
    )
  );
};

export default Paginate;

