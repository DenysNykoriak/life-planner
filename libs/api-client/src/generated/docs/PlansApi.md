# PlansApi

All URIs are relative to *http://localhost:3000/api*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**getPlansDay**](PlansApi.md#getplansday) | **GET** /plans/day/{dayTimestamp} |  |
| [**putPlansDay**](PlansApi.md#putplansday) | **PUT** /plans/day/{dayTimestamp} |  |



## getPlansDay

> DayPlanDto getPlansDay(dayTimestamp)



### Example

```ts
import {
  Configuration,
  PlansApi,
} from '';
import type { GetPlansDayRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure API key authorization: cookieAuth
    apiKey: "YOUR API KEY",
  });
  const api = new PlansApi(config);

  const body = {
    // number
    dayTimestamp: 789,
  } satisfies GetPlansDayRequest;

  try {
    const data = await api.getPlansDay(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **dayTimestamp** | `number` |  | [Defaults to `undefined`] |

### Return type

[**DayPlanDto**](DayPlanDto.md)

### Authorization

[cookieAuth](../README.md#cookieAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Day plan |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## putPlansDay

> DayPlanDto putPlansDay(dayTimestamp, updatePlanDto)



### Example

```ts
import {
  Configuration,
  PlansApi,
} from '';
import type { PutPlansDayRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure API key authorization: cookieAuth
    apiKey: "YOUR API KEY",
  });
  const api = new PlansApi(config);

  const body = {
    // number
    dayTimestamp: 789,
    // UpdatePlanDto
    updatePlanDto: ...,
  } satisfies PutPlansDayRequest;

  try {
    const data = await api.putPlansDay(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **dayTimestamp** | `number` |  | [Defaults to `undefined`] |
| **updatePlanDto** | [UpdatePlanDto](UpdatePlanDto.md) |  | |

### Return type

[**DayPlanDto**](DayPlanDto.md)

### Authorization

[cookieAuth](../README.md#cookieAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Updated plan |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

