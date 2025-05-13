;`id
    handle
    products(first: 10) {
      edges {
        node {
          id
          title
          status
          priceRange {
            minVariantPrice {
              amount
            }
          }
          images(first: 2) {
            edges {
              node {
                id
                url
                altText
              }
            }
          }
          options(first: 10) {
            name
            values
          }
        }
      }
    }`
