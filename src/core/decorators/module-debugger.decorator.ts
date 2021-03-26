import { ModuleMetadata } from "@nestjs/common";

export function ModuleDebugger(metadata: ModuleMetadata): ClassDecorator {
  const propsKeys = Object.keys(metadata);
  // validateModuleKeys(propsKeys);

  return (target: Function) => {
    for (const property in metadata) {
      if (metadata.hasOwnProperty(property)) {
        // Reflect.defineMetadata(property, (metadata as any)[property], target);
        const subMetadata = Reflect.getMetadata(property, target);
        // console.log(
        //   'ModuleDebugger',
        //   subMetadata,
        // )
      }
    }
  };
}
