//types
import type { ExtendsType } from '../types';
import type { SelectProps, SelectOption } from './Select';
//components
import Select from './Select';
//data
import currencies from '../data/currencies';
import countries from '../data/countries';

/**
 * Currency Data
 */
export type CurrencyData = {
  flag: string,
  type: string,
  code: string,
  name: string,
  plural: string,
  symbol: string
}

/**
 * Currency Option
 */
export type CurrencyOption = SelectOption<CurrencyData>;

/**
 * Currency Config
 */
export type CurrencyConfig = {
  value?: string,
  defaultValue?: string,
  map: (country: CurrencyData) => CurrencyOption
};

/**
 * Currency Props
 */
export type CurrencyProps = ExtendsType<SelectProps, {
  options?: undefined,
  value?: string,
  defaultValue?: string
}>;

/**
 * Currency Hook Aggregate
 */
export function useCurrency(config: CurrencyConfig) {
  const { value, defaultValue, map } = config;
  //generate options
  const options = currencies
    .filter(currency => currency.type === 'fiat')
    .map(currency => ({ 
      ...currency, 
      flag: countries.find(
        country => country.cur === currency.code
      )?.flag 
    }))
    .filter(currency => !!currency.flag)
    .map(currency => map(currency as CurrencyData));

  const selected = typeof value === 'string' 
    ? options.filter(
        option => option.value?.code === value
      )[0] as CurrencyOption
    : undefined;

  const selectedDefault = typeof defaultValue === 'string' 
    ? options.filter(
        option => option.value?.code === defaultValue
      )[0] as CurrencyOption
    : undefined;

  return { selected, selectedDefault, options };
};

/**
 * Styled Currency  Component (Main)
 */
export default function Currency(props: CurrencyProps) {
  const { 
    value, 
    defaultValue, 
    placeholder = 'Choose a Currency', 
    ...attributes 
  } = props;
  const { selected, selectedDefault, options } = useCurrency({
    value, 
    defaultValue, 
    map: currency => ({
      label: (
        <>
          <span className="text-lg">{currency.flag}</span>
          <span className="frui-field-select-label">
            {currency.name} ({currency.code})
          </span>  
        </>
      ),
      value: currency,
      keyword: (keyword: string) => currency.code.toLowerCase().indexOf(keyword) >= 0
        || currency.name.toLowerCase().indexOf(keyword) >= 0
        || currency.code.toLowerCase().indexOf(keyword) >= 0
    })
  });

  return (
    <Select<CurrencyData>
      {...attributes} 
      placeholder={placeholder} 
      value={selected} 
      defaultValue={selectedDefault}
      options={options} 
      searchable={true} 
    />
  );
};