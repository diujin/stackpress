//modules
import type { Directory } from 'ts-morph';
//registry
import type Registry from '../../schema/Registry';
import type Column from '../../schema/spec/Column';
import type Model from '../../schema/spec/Model';

export default function generate(directory: Directory, registry: Registry) {
  //for each model
  for (const model of registry.model.values()) {
    //generate all column formats
    model.columns.forEach(
      column => generateFormat(directory, model, column)
    );
  }
}

export function generateFormat(
  directory: Directory, 
  model: Model,
  column: Column
) {
  //skip if no format component
  if (typeof column.list.component !== 'string') return;
  //get the path where this should be saved
  const path = `${model.name}/components/lists/${column.title}ListFormat.tsx`;
  const source = directory.createSourceFile(path, '', { overwrite: true });
  //import Text from 'frui/format/Text';
  source.addImportDeclaration({
    moduleSpecifier: `frui/format/${column.list.component}`,
    defaultImport: column.list.component
  });
  const props = `{ value: ${
    column.typemap.format}${column.multiple ? '[]': ''
  } }`;
  //export function NameFormat() {
  source.addFunction({
    isDefaultExport: true,
    name: `${column.title}Format`,
    parameters: [
      { name: 'props', type: props }
    ],
    statements: (`
      //props
      const { value } = props;
      const attributes = ${JSON.stringify(column.list.attributes)};
      //render
      return (
        <${column.list.component} {...attributes} value={value} />
      );
    `)
  });
}