
# DayPlanDto


## Properties

Name | Type
------------ | -------------
`date` | number
`items` | [Array&lt;PlanItemDto&gt;](PlanItemDto.md)

## Example

```typescript
import type { DayPlanDto } from ''

// TODO: Update the object below with actual values
const example = {
  "date": null,
  "items": null,
} satisfies DayPlanDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as DayPlanDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


