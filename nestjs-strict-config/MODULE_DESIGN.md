# 새로운 nestjs config 관리 모듈

- 새로운 방식으로 config module를 구성할 필요가 있다.

## 요구사항(타협불가능한 설계)

- `import ~~~ from '@nestjs/config';` 부분만 `import ~~~ from 'nestjs-strict-config';` 로 바꾸면 끝나야함. 즉 제공하는 모든 메서드를 다 제공해줘야함.(extends or implemented?? )
- `app.module.ts` 가 아니라 필요한 모듈 내부에서 각자 쓸 수 있게 할것. 예를들어 `Hello`라는 모듈이 있으면 `HelloConfigService`를 만들어서 그 안에서만 쓸 수 있도록
- 빼먹은거 없는지 확인해주는 기능
- 그룹으로 접근이 가능해야함.
- dotenv 기능을 내장해야함
- process.env의 값을 바꿀수있어야함
- process.env 값 겹치는거 알려줘야함
- 테스트가 쉬워야함
- this.configService.get('')
- namespace 자동완성지원해야함

- 참고

  - nestjs-easyconfig

- 이름 후보
  nestjs-strict-config
  nestjs-konfig

- configservice에 데코레이터 이용해서 metadata를 등록해두고, configmodule init할때 모든 앱의 injectable에서 메타데이터가 ~~인 클래스를 다 들고오기가 가능한가?

- app.config.service.ts 에서 AppConfigServiceClass는 ConfigValidate를 impl 한다.
- 이때 반드시 @injectable 사용해서 nest container를 이용한다.
- ConfigEnvModule.forRootAsync를 하면 모든 config service를 가져와서 validateEnv를 실행한다.
- 어떻게 가져올지는 ConfigEnvModule.forRootAsync의 useFactory에서 결정한다.

```ts
// declare const objectType: <T extends ZodRawShape>(
//   shape: T,
//   params?: RawCreateParams,
// ) => ZodObject<
//   T,
//   'strip',
//   ZodTypeAny,
//   {
//     [k_1 in keyof objectUtil.addQuestionMarks<
//       baseObjectOutputType<T>,
//       { [k in keyof baseObjectOutputType<T>]: undefined extends baseObjectOutputType<T>[k] ? never : k }[keyof T]
//     >]: objectUtil.addQuestionMarks<
//       baseObjectOutputType<T>,
//       { [k in keyof baseObjectOutputType<T>]: undefined extends baseObjectOutputType<T>[k] ? never : k }[keyof T]
//     >[k_1];
//   },
//   { [k_2 in keyof baseObjectInputType<T>]: baseObjectInputType<T>[k_2] }
// >;
```

```ts
// FIXME: EnvironmentVariables 이 타입을 validator에서 추출할 수 있으면 좋을텐데
// type NestedKey<O extends Record<string, unknown>> = {
//   [K in Extract<keyof O, string>]: O[K] extends Array<any>
//     ? K
//     : O[K] extends Record<string, unknown>
//     ? `${K}` | `${K}.${NestedKey<O[K]>}`
//     : K;
// }[Extract<keyof O, string>];
```

- https://velog.io/@pk3669/Nest%EC%97%90%EC%84%9C-%EB%8B%A4%EC%9D%B4%EB%82%98%EB%AF%B9-%EB%AA%A8%EB%93%88Dynamic-module-%EA%B0%9C%EB%85%90%EB%A7%8C-%EC%95%8C%EC%95%84%EB%B3%B4%EA%B8%B0
- https://dev.to/nestjs/advanced-nestjs-how-to-build-completely-dynamic-nestjs-modules-1370
- https://the-masked-developer.github.io/wiki/%5Bnestjs%5Ddynamic-module/
- https://www.npmjs.com/package/nestjs-dotenv
- https://www.npmjs.com/package/nestjs-env-config
- https://www.npmjs.com/package/@rnw-community/nestjs-typed-config
- https://github.com/ukitgroup/nestjs-config/blob/master/src/lib/facade.ts
- https://www.npmjs.com/package/nestjs-config-extended
- nestjs-config https://www.npmjs.com/package/nestjs-config
- nestjs-dotenv
- nestjs-env https://github.com/AntsiferovMaxim/nestjs-env
- nestjs-env-config
- nestjs-configuration
- nestjs-config-env
- nestjs-typed-config

- process.env를 직접 바꾸는 옵션
-
- @Env() 데코레이터추가
-
- @Env({default:(value)=>value.toLowerCase()})
-
- @Env({default: 3000})
- [https://blog.devgenius.io/manage-azure-storage-blob-in-nestjs-daf5cb5125d4](https://blog.devgenius.io/manage-azure-storage-blob-in-nestjs-daf5cb5125d4)
- [https://dmrelease.blob.core.windows.net/azurestoragejssample/samples/sample-blob.html](https://dmrelease.blob.core.windows.net/azurestoragejssample/samples/sample-blob.html)
- [https://docs.microsoft.com/en-us/azure/storage/common/storage-sas-overview](https://docs.microsoft.com/en-us/azure/storage/common/storage-sas-overview)
- [https://docs.microsoft.com/ko-kr/azure/storage/blobs/quickstart-blobs-javascript-browser](https://docs.microsoft.com/ko-kr/azure/storage/blobs/quickstart-blobs-javascript-browser)
- [https://github.com/Azure-Samples/functions-dotnet-sas-token/blob/master/README.md](https://github.com/Azure-Samples/functions-dotnet-sas-token/blob/master/README.md)
- [https://github.com/Azure-Samples/functions-node-sas-token/blob/master/GetSasToken-Node/index.js#L18](https://github.com/Azure-Samples/functions-node-sas-token/blob/master/GetSasToken-Node/index.js#L18)
- [https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/storage/storage-blob/samples/v12/typescript](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/storage/storage-blob/samples/v12/typescript)
- [https://www.youtube.com/watch?v=hIAKzDz09tc](https://www.youtube.com/watch?v=hIAKzDz09tc)
- [https://www.youtube.com/watch?v=Z9HeNZ8lmi4](https://www.youtube.com/watch?v=Z9HeNZ8lmi4)
