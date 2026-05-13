
# KnowledgeEntryDto


## Properties

Name | Type
------------ | -------------
`id` | string
`rawText` | string
`tags` | Array&lt;string&gt;
`projectId` | string
`createdAt` | number

## Example

```typescript
import type { KnowledgeEntryDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "rawText": null,
  "tags": null,
  "projectId": null,
  "createdAt": null,
} satisfies KnowledgeEntryDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as KnowledgeEntryDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


