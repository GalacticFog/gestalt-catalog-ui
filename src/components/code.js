import React from 'react';
import AceEditor from 'react-ace';
import 'brace/mode/yaml';
import 'brace/theme/terminal';

const Code = ({ value }) => (
  <AceEditor
    mode="yaml"
    theme="terminal"
    name="YAML-Assets"
    value={value}
    readOnly
    width="100%"
    showPrintMargin={false}
    editorProps={{ $blockScrolling: true }}
  />
);

export default Code;
