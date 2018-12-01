# gql-query-ninja

Query builder for GraphQL

```
npm i gql-query-ninja
```

## Features

- `Query`, `Mutation`, `Subscription`
- Nested fields
- Merging different queries into one
- Auto vars generating when using args
- Composable API

## Get Started

```js
import { Query } from 'gql-query-ninja'

new Query('tasks')
  .args({
    taskId: {
      type: 'String',
    },
  })
  .fields({
    id: true,
    name: true,
    desc: true,
  })
  .build()
```

and as a result you will get:

```
query (
  $taskId: String!
) {
  tasks (
    taskId: $taskId
  ) {
    id
    name
    desc
  }
}
```

## Examples

For more examples check out tests
