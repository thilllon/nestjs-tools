# nestjs-tools

### Create a new publishable package

- Use vscode nx extension.
- Select Nx: generate (ui)
- Select @nx/nest - library
- Use project name as `nestjs-tools-foobar` with prefix `nestjs-tools-` if the package name `nest-foobar` is taken in NPM, otherwise use `nestjs-foobar`
- If the package name starts with `@nestjs-tools/` like `@nestjs-tools/foobar`, then import path should be `@nestjs-tools/foobar` so that NPM packages are under the same namespace `@nestjs-tools`

### NPM Publish

```sh
# example: node tools/scripts/publish.mjs $name_in_project.json $version $tag
node tools/scripts/publish.mjs nestjs-tools-foobar 0.3.2 latest
```

And follow the guide at terminal.
