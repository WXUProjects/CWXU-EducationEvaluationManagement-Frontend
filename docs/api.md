---
title: 默认模块
language_tabs:
  - shell: Shell
  - http: HTTP
  - javascript: JavaScript
  - ruby: Ruby
  - python: Python
  - php: PHP
  - java: Java
  - go: Go
toc_footers: []
includes: []
search: true
code_clipboard: true
highlight_theme: darkula
headingLevel: 2
generator: "@tarslib/widdershins v4.0.30"

---

# 默认模块

Base URLs:

# Authentication

- HTTP Authentication, scheme: bearer

- HTTP Authentication, scheme: bearer

# Default

## GET 导出

GET /api/v1/task/export

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|taskId|query|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "message": "导出成功",
  "filePath": "./tmp/评教结果.xlsx"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## POST 重置基础信息

POST /api/v1/base-info/reset

重置除学生、教师之外的所有信息。
建议每学期执行一次，弹窗提醒

> Body 请求参数

```json
{}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 是 |none|

> 返回示例

> 200 Response

```json
{
  "message": "重置成功"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

# 基础信息

## POST 导入学生信息

POST /api/v1/base-info/student/import

> Body 请求参数

```yaml
file: file:///Users/sanenchen/Desktop/录入模版/学生信息导入模版.xlsx

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 是 |none|
|» file|body|string(binary)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "msg": "上传成功"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» message|string|true|none||none|

## POST 导入教师信息

POST /api/v1/base-info/teacher/import

> Body 请求参数

```yaml
file: file:///Users/sanenchen/Desktop/录入模版/教师信息导入模版.xlsx

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 是 |none|
|» file|body|string(binary)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "msg": "上传成功"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» message|string|true|none||none|

## GET 获取学生列表/信息

GET /api/v1/base-info/student/list

获取学生列表（支持查询）

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|page|query|integer| 是 |页码 默认1|
|pageSize|query|integer| 是 |页大小 默认10|
|name|query|string| 否 |姓名模糊查询|
|studentNo|query|string| 否 |学号前缀模糊查询|

> 返回示例

> 200 Response

```json
{
  "message": "success",
  "data": [
    {
      "id": 21,
      "name": "伞恩晨",
      "sex": "男",
      "studentNo": "25346121",
      "idCardNo": "320721200703190000"
    }
  ]
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» message|string|true|none||none|
|» data|[object]|true|none||none|
|»» id|integer|false|none||none|
|»» name|string|false|none||none|
|»» sex|string|false|none||none|
|»» studentNo|string|false|none||none|
|»» idCardNo|string|false|none||none|
|» total|integer|true|none||none|

## GET 获取教师列表

GET /api/v1/base-info/teacher/list

获取教师列表（支持查询）

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|page|query|integer| 是 |页码 默认1|
|pageSize|query|integer| 是 |页大小 默认10|
|name|query|string| 否 |姓名模糊查询|
|workNo|query|string| 否 |教师工号前缀模糊查询|

> 返回示例

> 200 Response

```json
{
  "message": "success",
  "data": [
    {
      "id": 40,
      "name": " Ilia Markov ",
      "sex": "男",
      "workNo": "2533460",
      "email": "srcenchen@gmail.com"
    },
    {
      "id": 32,
      "name": " Borislav Markov ",
      "sex": "男",
      "workNo": "2533452",
      "email": "srcenchen@gmail.com"
    }
  ]
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» message|string|true|none||none|
|» data|[object]|true|none||none|
|»» id|integer|true|none||none|
|»» name|string|true|none||none|
|»» sex|string|true|none||none|
|»» workNo|string|true|none||none|
|»» email|string|true|none||none|
|»» studentNo|string|false|none||none|
|»» idCardNo|string|false|none||none|
|» total|string|true|none||none|

## POST 删除学生

POST /api/v1/base-info/student/delete

> Body 请求参数

```json
{
  "id": 21
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 500,
  "reason": "",
  "message": "record not found",
  "metadata": {}
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» message|string|true|none||none|

## POST 删除老师

POST /api/v1/base-info/teacher/delete

> Body 请求参数

```json
{
  "id": 37
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 是 |none|
|» id|body|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "message": "删除成功"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## POST 修改学生信息

POST /api/v1/base-info/student/update

> Body 请求参数

```json
{
  "id": 1,
  "name": "张三",
  "sex": "女",
  "idCardNo": "320721200703195432"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 是 |none|
|» id|body|integer| 是 |none|
|» name|body|string| 是 |none|
|» sex|body|string| 是 |none|
|» idCardNo|body|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "message": "修改成功",
  "data": {
    "id": 1,
    "name": "张三",
    "sex": "女",
    "studentNo": "25346101",
    "idCardNo": "320721200703195432"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## POST 修改老师信息

POST /api/v1/base-info/teacher/update

> Body 请求参数

```json
{
  "id": 3,
  "name": "Ehsan",
  "sex": "女",
  "email": "2115707702@qq.com"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 是 |none|
|» id|body|integer| 是 |none|
|» name|body|string| 是 |none|
|» sex|body|string| 是 |none|
|» email|body|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "message": "修改成功",
  "data": {
    "id": 3,
    "name": "Ehsan",
    "sex": "女",
    "workNo": "2533423",
    "email": "2115707702@qq.com"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

# 评教任务

## POST 创建评教任务

POST /api/v1/task/create

> Body 请求参数

```json
{
  "name": "第一次评教",
  "courseIds": [
    1,
    2,
    3
  ]
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 是 |none|
|» name|body|string| 是 |none|
|» courseIds|body|[integer]| 是 |none|

> 返回示例

> 200 Response

```json
{
  "message": "创建成功",
  "id": "1"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» id|string|true|none||none|
|» id|string|true|none||none|

## GET 获取评教任务详情

GET /api/v1/task/detail

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|query|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "id": "1",
  "name": "第一次评教",
  "status": 0,
  "course": [
    {
      "id": "1",
      "name": "数据结构 - 25-数据结构-1班",
      "evaluationScore": 0,
      "evaluationNum": 0,
      "totalNum": 21
    },
    {
      "id": "2",
      "name": "高等数学下 - 25-高等数学下-1班",
      "evaluationScore": 0,
      "evaluationNum": 0,
      "totalNum": 21
    },
    {
      "id": "3",
      "name": "数据结构 - 25-数据结构-2班",
      "evaluationScore": 0,
      "evaluationNum": 0,
      "totalNum": 21
    }
  ]
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## GET 获取评教任务列表

GET /api/v1/task/list

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|status|query|string| 否 |-1代表是全部|
|page|query|string| 否 |none|
|pageSize|query|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "tasks": [
    {
      "id": "1",
      "name": "第一次评教",
      "status": 0,
      "course": []
    }
  ],
  "total": "1"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## POST 修改评教状态

POST /api/v1/task/change_status

> Body 请求参数

```json
{
  "id": 1,
  "status": 1
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 是 |none|

> 返回示例

> 200 Response

```json
{
  "message": "修改成功"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## GET 学生端根据学号和任务ID获取课程列表

GET /api/v1/task/student_task_detail

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|taskId|query|string| 否 |none|
|stuNo|query|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "message": "string",
  "course": [
    {
      "id": "string",
      "name": "string",
      "evaluationScore": 0,
      "evaluationNum": 0,
      "totalNum": 0,
      "teacher": [
        {
          "id": "string",
          "name": "string",
          "hasEvaluation": true
        }
      ]
    }
  ]
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» message|string|true|none||none|
|» course|[object]|true|none||none|
|»» id|string|true|none||none|
|»» name|string|true|none||none|
|»» evaluationScore|integer|true|none||none|
|»» evaluationNum|integer|true|none||none|
|»» totalNum|integer|true|none||none|
|»» teacher|[object]|true|none||none|
|»»» id|string|true|none||none|
|»»» name|string|true|none||none|
|»»» hasEvaluation|boolean|true|none||none|

## POST 学生评价

POST /api/v1/task/submit_evaluation

> Body 请求参数

```json
{
  "taskId": 1,
  "courseId": 1,
  "teacherId": 36,
  "stuNo": "25346119",
  "detailScore": "[5,5,5,5,5,5,5,5,5,5]",
  "score": 50,
  "comment": "老师讲课非常生动，受益匪浅。"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 是 |none|
|» taskId|body|integer| 是 |任务ID|
|» courseId|body|integer| 是 |课程ID|
|» teacherId|body|integer| 是 |教师ID|
|» stuNo|body|string| 是 |学生学号|
|» detailScore|body|string| 是 |每个小项得分，是一个字符串json[5,5,5,5]代表第一题5分第二题5分...|
|» score|body|integer| 是 |总得分|
|» comment|body|string| 是 |学生评价|

> 返回示例

> 200 Response

```json
{
  "code": 500,
  "reason": "",
  "message": "ERROR: insert or update on table \"evaluation_details\" violates foreign key constraint \"fk_evaluation_tasks_details\" (SQLSTATE 23503)",
  "metadata": {}
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» message|string|true|none||none|

# 课程管理

## POST 导入课程信息

POST /api/v1/base-info/course/import

> Body 请求参数

```yaml
file: file:///Users/sanenchen/Desktop/录入模版/课程信息导入.xlsx

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 是 |none|
|» file|body|string(binary)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "message": "课程:数据结构,班级:25-数据结构-1班,错误:已经存在此班级\n课程:高等数学下,班级:25-高等数学下-1班,错误:已经存在此班级\n课程:数据结构,班级:25-数据结构-2班,错误:已经存在此班级\n"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## GET 获取课程列表

GET /api/v1/base-info/course/list

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|page|query|string| 否 |none|
|pageSize|query|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "message": "success",
  "data": [
    {
      "id": 16,
      "courseName": "数据结构",
      "className": "25-数据结构-1班",
      "teacherList": []
    },
    {
      "id": 17,
      "courseName": "高等数学下",
      "className": "25-高等数学下-1班",
      "teacherList": []
    }
  ],
  "total": "3"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» message|string|true|none||none|
|» data|[object]|true|none||none|
|»» id|integer|true|none||none|
|»» courseName|string|true|none||none|
|»» className|string|true|none||none|
|»» status|integer|true|none||none|
|»» teacherList|[object]|true|none||none|
|»»» id|integer|true|none||none|
|»»» name|string|true|none||none|
|»»» sex|string|true|none||none|
|»»» workNo|string|true|none||none|
|»»» email|string|true|none||none|
|»» studentList|[string]|true|none||none|
|» total|string|true|none||none|

## GET 获取课程详情

GET /api/v1/base-info/course/detail

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|courseId|query|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "message": "success",
  "data": {
    "id": 16,
    "courseName": "数据结构",
    "className": "25-数据结构-1班",
    "status": 0,
    "teacherList": [],
    "studentList": [
      {
        "id": 1,
        "name": "巴欣怡",
        "sex": "女",
        "studentNo": "25346101",
        "idCardNo": ""
      },
      {
        "id": 2,
        "name": "陈诗韵",
        "sex": "女",
        "studentNo": "25346102",
        "idCardNo": ""
      },
      {
        "id": 3,
        "name": "陈文钦",
        "sex": "男",
        "studentNo": "25346103",
        "idCardNo": ""
      },
      {
        "id": 4,
        "name": "范睿",
        "sex": "男",
        "studentNo": "25346104",
        "idCardNo": ""
      },
      {
        "id": 5,
        "name": "高振贤",
        "sex": "男",
        "studentNo": "25346105",
        "idCardNo": ""
      },
      {
        "id": 6,
        "name": "葛子仪",
        "sex": "女",
        "studentNo": "25346106",
        "idCardNo": ""
      },
      {
        "id": 7,
        "name": "关一彤",
        "sex": "女",
        "studentNo": "25346107",
        "idCardNo": ""
      },
      {
        "id": 8,
        "name": "韩宇",
        "sex": "男",
        "studentNo": "25346108",
        "idCardNo": ""
      },
      {
        "id": 9,
        "name": "黄妙如",
        "sex": "女",
        "studentNo": "25346109",
        "idCardNo": ""
      },
      {
        "id": 10,
        "name": "金思源",
        "sex": "男",
        "studentNo": "25346110",
        "idCardNo": ""
      },
      {
        "id": 11,
        "name": "康薛杨",
        "sex": "女",
        "studentNo": "25346111",
        "idCardNo": ""
      },
      {
        "id": 12,
        "name": "李金鑫",
        "sex": "男",
        "studentNo": "25346112",
        "idCardNo": ""
      },
      {
        "id": 13,
        "name": "李星辰",
        "sex": "男",
        "studentNo": "25346113",
        "idCardNo": ""
      },
      {
        "id": 14,
        "name": "刘梦",
        "sex": "女",
        "studentNo": "25346114",
        "idCardNo": ""
      },
      {
        "id": 15,
        "name": "刘文翔",
        "sex": "男",
        "studentNo": "25346115",
        "idCardNo": ""
      },
      {
        "id": 16,
        "name": "刘逸阳",
        "sex": "男",
        "studentNo": "25346116",
        "idCardNo": ""
      },
      {
        "id": 17,
        "name": "骆梓妍",
        "sex": "女",
        "studentNo": "25346117",
        "idCardNo": ""
      },
      {
        "id": 18,
        "name": "马迟",
        "sex": "男",
        "studentNo": "25346118",
        "idCardNo": ""
      },
      {
        "id": 19,
        "name": "缪雨轩",
        "sex": "男",
        "studentNo": "25346119",
        "idCardNo": ""
      },
      {
        "id": 20,
        "name": "潘乙瑄",
        "sex": "男",
        "studentNo": "25346120",
        "idCardNo": ""
      },
      {
        "id": 21,
        "name": "伞恩晨",
        "sex": "男",
        "studentNo": "25346121",
        "idCardNo": ""
      }
    ]
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» id|integer|true|none||none|
|»» courseName|string|true|none||none|
|»» className|string|true|none||none|
|»» status|integer|true|none||none|
|»» teacherList|[object]|true|none||none|
|»»» id|integer|true|none||none|
|»»» name|string|true|none||none|
|»»» sex|string|true|none||none|
|»»» workNo|string|true|none||none|
|»»» email|string|true|none||none|
|»» studentList|[object]|true|none||none|
|»»» id|integer|true|none||none|
|»»» name|string|true|none||none|
|»»» sex|string|true|none||none|
|»»» studentNo|string|true|none||none|
|»»» idCardNo|string|true|none||none|

## POST 修改课程基本信息/绑定教师

POST /api/v1/base-info/course/edit

1代表上课中
2代表已结课
不需要手动结课，在一次评教任务包含课程后将会自动结课

> Body 请求参数

```json
{
  "courseId": 16,
  "courseName": "数据结构",
  "className": "25-数据结构-1班",
  "teacherIds": [
    39,
    38,
    37,
    36
  ]
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 是 |none|
|» courseId|body|integer| 是 |none|
|» courseName|body|string| 是 |none|
|» className|body|string| 是 |none|
|» teacherIds|body|[integer]| 是 |none|
|» status|body|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "message": "修改成功",
  "data": {
    "id": 16,
    "courseName": "数据结构",
    "className": "25-数据结构-1班",
    "status": 0,
    "teacherList": [
      {
        "id": 36,
        "name": " Dima Naoumov ",
        "sex": "",
        "workNo": "2533456",
        "email": "srcenchen@gmail.com"
      },
      {
        "id": 37,
        "name": " Denis Putin ",
        "sex": "",
        "workNo": "2533457",
        "email": "srcenchen@gmail.com"
      },
      {
        "id": 38,
        "name": " Klim Fedorov ",
        "sex": "",
        "workNo": "2533458",
        "email": "srcenchen@gmail.com"
      },
      {
        "id": 39,
        "name": " Foka Zima ",
        "sex": "",
        "workNo": "2533459",
        "email": "srcenchen@gmail.com"
      }
    ],
    "studentList": []
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» id|integer|true|none||none|
|»» courseName|string|true|none||none|
|»» className|string|true|none||none|
|»» status|integer|true|none||none|
|»» teacherList|[object]|true|none||none|
|»»» id|integer|true|none||none|
|»»» name|string|true|none||none|
|»»» sex|string|true|none||none|
|»»» workNo|string|true|none||none|
|»»» email|string|true|none||none|
|»» studentList|[string]|true|none||none|

## POST 删除课程

POST /api/v1/base-info/course/delete

> Body 请求参数

```json
{
  "id": 1
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 是 |none|

> 返回示例

> 401 Response

```json
{
  "code": 0,
  "reason": "string",
  "message": "string",
  "metadata": {}
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|none|Inline|

### 返回数据结构

状态码 **401**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» reason|string|true|none||none|
|» message|string|true|none||none|
|» metadata|object|true|none||none|

# 认证模块

## GET 获取学生个人信息

GET /api/v1/auth/student/info

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|stuNo|query|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 500,
  "reason": "",
  "message": "学号不能为空",
  "metadata": {}
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## POST 学生登录

POST /api/v1/auth/student/login

> Body 请求参数

```json
{
  "stu_no": "25346121",
  "card_no": "320721200703190000",
  "task_id": 1
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 是 |none|
|» stuNo|body|string| 是 |none|
|» cardNo|body|string| 是 |none|
|» taskId|body|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "message": "登录成功",
  "data": {
    "student_no": "25346121",
    "name": "伞恩晨"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## POST 管理员登录

POST /api/v1/auth/admin/login

> Body 请求参数

```json
{
  "username": "admin",
  "password": "admin"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 是 |none|
|» username|body|string| 是 |none|
|» password|body|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "message": "登录成功"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» message|string|true|none||none|
|» token|string|true|none||none|

## POST 管理员密码修改

POST /api/v1/auth/admin/change-password

> Body 请求参数

```json
{
  "username": "admin",
  "oldPassword": "sanenchen123",
  "newPassword": "admin"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 是 |none|

> 返回示例

> 200 Response

```json
{
  "message": "密码修改成功"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

# 问题模块

## POST 更新问题

POST /api/v1/question/update

> Body 请求参数

```json
{
  "questions": [
    {
      "content": "教师教学态度端正，备课充分",
      "score": 10,
      "sort": 1
    },
    {
      "content": "教学方法灵活，课堂互动良好",
      "score": 10,
      "sort": 2
    },
    {
      "content": "作业批改认真，反馈及时",
      "score": 10,
      "sort": 3
    },
    {
      "content": "教学效果显著，收获较大",
      "score": 10,
      "sort": 4
    }
  ]
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 是 |none|

> 返回示例

> 200 Response

```json
{
  "message": "更新成功"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## GET 获取问题列表

GET /api/v1/question/list

> 返回示例

> 200 Response

```json
{
  "message": "获取成功",
  "data": [
    {
      "id": 5,
      "content": "教师教学态度端正，备课充分",
      "score": 10,
      "sort": 1
    },
    {
      "id": 6,
      "content": "教学方法灵活，课堂互动良好",
      "score": 10,
      "sort": 2
    },
    {
      "id": 7,
      "content": "作业批改认真，反馈及时",
      "score": 10,
      "sort": 3
    },
    {
      "id": 8,
      "content": "教学效果显著，收获较大",
      "score": 10,
      "sort": 4
    }
  ]
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

# 数据模型

