import React from 'react';
import AceEditor from 'react-ace';
import 'brace/mode/yaml';
import 'brace/mode/json';
import 'brace/theme/terminal';

const Code = ({ value, mode = "yaml" }) => (
  <AceEditor
    mode={mode}
    theme="terminal"
    name="YAML-assets"
    value={value}
    readOnly
    width="100%"
    showPrintMargin={false}
    editorProps={{ $blockScrolling: true }}
  />
);

export default Code;
