# KnowledgeApi

All URIs are relative to *http://localhost:3000/api*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**deleteKnowledge**](KnowledgeApi.md#deleteknowledge) | **DELETE** /knowledge/{id} |  |
| [**getKnowledge**](KnowledgeApi.md#getknowledge) | **GET** /knowledge |  |
| [**getKnowledgeQueue**](KnowledgeApi.md#getknowledgequeue) | **GET** /knowledge/queue |  |
| [**patchKnowledge**](KnowledgeApi.md#patchknowledge) | **PATCH** /knowledge/{id} |  |
| [**postKnowledge**](KnowledgeApi.md#postknowledge) | **POST** /knowledge |  |



## deleteKnowledge

> deleteKnowledge(id)



### Example

```ts
import {
  Configuration,
  KnowledgeApi,
} from '';
import type { DeleteKnowledgeRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure API key authorization: cookieAuth
    apiKey: "YOUR API KEY",
  });
  const api = new KnowledgeApi(config);

  const body = {
    // string
    id: id_example,
  } satisfies DeleteKnowledgeRequest;

  try {
    const data = await api.deleteKnowledge(body);
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
| **id** | `string` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[cookieAuth](../README.md#cookieAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **204** | Deleted |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getKnowledge

> Array&lt;KnowledgeEntryDto&gt; getKnowledge()



### Example

```ts
import {
  Configuration,
  KnowledgeApi,
} from '';
import type { GetKnowledgeRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure API key authorization: cookieAuth
    apiKey: "YOUR API KEY",
  });
  const api = new KnowledgeApi(config);

  try {
    const data = await api.getKnowledge();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**Array&lt;KnowledgeEntryDto&gt;**](KnowledgeEntryDto.md)

### Authorization

[cookieAuth](../README.md#cookieAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | All knowledge entries for the user |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getKnowledgeQueue

> Array&lt;KnowledgeQueueItemDto&gt; getKnowledgeQueue()



### Example

```ts
import {
  Configuration,
  KnowledgeApi,
} from '';
import type { GetKnowledgeQueueRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure API key authorization: cookieAuth
    apiKey: "YOUR API KEY",
  });
  const api = new KnowledgeApi(config);

  try {
    const data = await api.getKnowledgeQueue();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**Array&lt;KnowledgeQueueItemDto&gt;**](KnowledgeQueueItemDto.md)

### Authorization

[cookieAuth](../README.md#cookieAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Current categorization queue |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## patchKnowledge

> KnowledgeEntryDto patchKnowledge(id, updateKnowledgeDto)



### Example

```ts
import {
  Configuration,
  KnowledgeApi,
} from '';
import type { PatchKnowledgeRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure API key authorization: cookieAuth
    apiKey: "YOUR API KEY",
  });
  const api = new KnowledgeApi(config);

  const body = {
    // string
    id: id_example,
    // UpdateKnowledgeDto
    updateKnowledgeDto: ...,
  } satisfies PatchKnowledgeRequest;

  try {
    const data = await api.patchKnowledge(body);
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
| **id** | `string` |  | [Defaults to `undefined`] |
| **updateKnowledgeDto** | [UpdateKnowledgeDto](UpdateKnowledgeDto.md) |  | |

### Return type

[**KnowledgeEntryDto**](KnowledgeEntryDto.md)

### Authorization

[cookieAuth](../README.md#cookieAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Updated knowledge entry |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## postKnowledge

> KnowledgeEntryDto postKnowledge(createKnowledgeDto)



### Example

```ts
import {
  Configuration,
  KnowledgeApi,
} from '';
import type { PostKnowledgeRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure API key authorization: cookieAuth
    apiKey: "YOUR API KEY",
  });
  const api = new KnowledgeApi(config);

  const body = {
    // CreateKnowledgeDto
    createKnowledgeDto: ...,
  } satisfies PostKnowledgeRequest;

  try {
    const data = await api.postKnowledge(body);
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
| **createKnowledgeDto** | [CreateKnowledgeDto](CreateKnowledgeDto.md) |  | |

### Return type

[**KnowledgeEntryDto**](KnowledgeEntryDto.md)

### Authorization

[cookieAuth](../README.md#cookieAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Created knowledge entry |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

