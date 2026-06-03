import { useMemo } from 'react';
import ReactQuill from 'react-quill';

const toolbarOptions = [
  ['bold', 'italic', 'underline'],
  [{ header: 1 }, { header: 2 }],
  [{ list: 'bullet' }, { list: 'ordered' }]
];

export default function DocumentToolbar({ value, onChange, readOnly = false }) {
  const modules = useMemo(
    () => ({
      toolbar: readOnly ? false : toolbarOptions
    }),
    [readOnly]
  );

  const formats = [
    'bold',
    'italic',
    'underline',
    'header',
    'list',
    'bullet',
    'ordered'
  ];

  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      modules={modules}
      formats={formats}
      placeholder="Start writing..."
    />
  );
}

