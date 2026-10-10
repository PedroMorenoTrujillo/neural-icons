# @neural-icons/angular

Standalone Angular 22 renderer for `@neural-icons/core` definitions.

[Browse all icons](https://icons.neuralui.org/) · [Installation and usage](https://icons.neuralui.org/guide/)

Install the matching stable packages in an Angular 22 application:

```sh
npm install @neural-icons/core@1.1.0 @neural-icons/angular@1.1.0
```

These versions use the 250-family catalog. Angular accepts compatible Core 1.x
updates, including future icon additions, without an adapter release.

Register only the icons your application uses. String names resolve synchronously
through Angular dependency injection, without bundling the full catalog:

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideNeuralIcons } from '@neural-icons/angular';
import { iconDownload } from '@neural-icons/core/icons/download';
import { iconSave } from '@neural-icons/core/icons/save';

bootstrapApplication(AppComponent, {
  providers: [provideNeuralIcons(iconSave, iconDownload)],
});
```

```html
<neural-icon icon="save" /> <neural-icon icon="download" label="Download" />
```

The direct-definition path needs no provider and retains maximum tree-shaking:

```html
<neural-icon [icon]="iconCheck" label="Complete" />
```

Multiple `provideNeuralIcons(...)` calls compose; the last definition for a
duplicate name wins. An unregistered name renders no SVG and emits one warning
per icon instance and name in Angular development mode. Names never become
accessibility labels automatically.

For convenience over bundle size, `provideAllNeuralIcons()` registers the whole
catalog intentionally:

```ts
import { provideAllNeuralIcons } from '@neural-icons/angular';

bootstrapApplication(AppComponent, {
  providers: [provideAllNeuralIcons()],
});
```

The renderer is OnPush, zoneless-compatible, SSR-safe, and hydration-deterministic.
It supports Angular 22 only.
