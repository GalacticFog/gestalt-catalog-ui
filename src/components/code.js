import React from 'react';

const Code = ({ value, mode = 'yaml' }) => {
  if (typeof window !== 'undefined') {
    const Ace = require('react-ace').default;
    require('brace/mode/yaml');
    require('brace/mode/json');
    require('brace/theme/tomorrow_night_eighties');
    require('brace/ext/searchbox');

    return (
      <Ace
        mode={mode}
        theme="tomorrow_night_eighties"
        name={`${mode}-payload`}
        value={value}
        readOnly
        width="100%"
        // height="calc(100vh - 56px)"
        showPrintMargin={false}
        editorProps={{ $blockScrolling: true }}
      />
    );
  }

  return null;
};

export default Code;
