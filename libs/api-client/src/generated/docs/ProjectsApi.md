# ProjectsApi

All URIs are relative to *http://localhost:3000/api*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**deleteProject**](ProjectsApi.md#deleteproject) | **DELETE** /projects/{id} |  |
| [**getProjects**](ProjectsApi.md#getprojects) | **GET** /projects |  |
| [**postProject**](ProjectsApi.md#postproject) | **POST** /projects |  |



## deleteProject

> deleteProject(id)



### Example

```ts
import {
  Configuration,
  ProjectsApi,
} from '';
import type { DeleteProjectRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure API key authorization: cookieAuth
    apiKey: "YOUR API KEY",
  });
  const api = new ProjectsApi(config);

  const body = {
    // string
    id: id_example,
  } satisfies DeleteProjectRequest;

  try {
    const data = await api.deleteProject(body);
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


## getProjects

> Array&lt;ProjectDto&gt; getProjects()



### Example

```ts
import {
  Configuration,
  ProjectsApi,
} from '';
import type { GetProjectsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure API key authorization: cookieAuth
    apiKey: "YOUR API KEY",
  });
  const api = new ProjectsApi(config);

  try {
    const data = await api.getProjects();
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

[**Array&lt;ProjectDto&gt;**](ProjectDto.md)

### Authorization

[cookieAuth](../README.md#cookieAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | All projects for the user |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## postProject

> ProjectDto postProject(createProjectDto)



### Example

```ts
import {
  Configuration,
  ProjectsApi,
} from '';
import type { PostProjectRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure API key authorization: cookieAuth
    apiKey: "YOUR API KEY",
  });
  const api = new ProjectsApi(config);

  const body = {
    // CreateProjectDto
    createProjectDto: ...,
  } satisfies PostProjectRequest;

  try {
    const data = await api.postProject(body);
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
| **createProjectDto** | [CreateProjectDto](CreateProjectDto.md) |  | |

### Return type

[**ProjectDto**](ProjectDto.md)

### Authorization

[cookieAuth](../README.md#cookieAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Created project |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

