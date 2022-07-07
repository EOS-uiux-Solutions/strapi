import React, { memo, useMemo } from 'react';
// Other imports
// ...
// Import the Inputs component from our component library Buffet.js
import { Inputs as InputsIndex } from '@buffetjs/custom';

// Import the Hook with which you can access the Field API
import { useStrapi } from 'strapi-helper-plugin';

function Inputs({ autoFocus, keys, layout, name, onBlur }) {
  // This is where you will access the field API
  const {
    strapi: { fieldApi },
  } = useStrapi();

  // Other boilerplate code
  // ...

  return (
    <FormattedMessage id={errorId}>
      {error => {
        return (
          <InputsIndex
            {...metadatas}
            autoComplete="new-password"
            autoFocus={autoFocus}
            didCheckErrors={didCheckErrors}
            disabled={disabled}
            error={
              isEmpty(error) || errorId === temporaryErrorIdUntilBuffetjsSupportsFormattedMessage
                ? null
                : error
            }
            inputDescription={description}
            description={description}
            contentTypeUID={layout.uid}
            customInputs={{
              json: InputJSONWithErrors,
              wysiwyg: WysiwygWithErrors,
              uid: InputUID,

              // Retrieve all the fields that other plugins have registered
              ...fieldApi.getFields(),
            }}
            multiple={get(attribute, 'multiple', false)}
            attribute={attribute}
            name={keys}
            onBlur={onBlur}
            onChange={onChange}
            options={enumOptions}
            step={step}
            type={getInputType(type)}
            validations={validations}
            value={inputValue}
            withDefaultValue={false}
          />
        );
      }}
    </FormattedMessage>
  );
}