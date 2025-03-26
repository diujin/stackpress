//types
import type { FieldsProps, FieldsetProps } from '../elements/Fieldset';
//components
import Input from './Input';
import Button from '../elements/Button';
import make from '../elements/Fieldset';

/**
 * Textlist Type
 */
export type TextlistType = string;

/**
 * Textlist Config
 */
export type TextlistConfig = {
  type?: string,
  values?: (TextlistType|undefined)[],
  index: number,
  set: (values: (TextlistType|undefined)[]) => void
};

/**
 * Textlist Props
 */
export type TextlistProps = FieldsetProps<TextlistType> & {
  placeholder?: string
};

/**
 * Textlist Hook Aggregate
 */
export function useTextlists(config: TextlistConfig) {
  const { values, index, set } = config;
  //handlers
  const handlers = {
    update: (value: string) => {
      const newValues = [ ...(values || []) ]
      newValues[index] = value;
      set(newValues);
    },
    remove: () => {
      const newValues = [ ...(values || []) ];
      newValues[index] = undefined;
      set(newValues);
    }
  };
  
  return { handlers };
}

/**
 * Text Item Component 
 */
export function TextlistFields(props: FieldsProps<TextlistType>) {
  const { 
    config,
    values, 
    index, 
    error,
    set
  } = props;
  //variables
  const placeholder = config?.placeholder as string | undefined;
  //handlers
  const { handlers } = useTextlists({ values, index, set });

  return (
    <div className="frui-field-textlist-row">
      <Input
        className="frui-field-textlist-input"
        placeholder={placeholder}
        defaultValue={values ? values[index]: undefined}
        onUpdate={handlers.update}
        error={error}
        required 
      />
      <Button 
        outline
        error
        onClick={handlers.remove}
        className="frui-field-textlist-remove"
      >
        &times;
      </Button>
    </div>
  );
};

const Fieldset = make<TextlistType>(TextlistFields);

/**
 * Textlist set Component (Main)
 */
export default function Textlist(props: TextlistProps) {
  const { placeholder, ...attributes } = props;
  const config = { placeholder };
  return (
    <Fieldset {...attributes} config={config} emptyValue="" />
  );
};