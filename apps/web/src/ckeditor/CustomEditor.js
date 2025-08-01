// src/ckeditor/CustomEditor.js

import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic'
import { Essentials } from '@ckeditor/ckeditor5-essentials'
import { Bold, Italic } from '@ckeditor/ckeditor5-basic-styles'
import { Paragraph } from '@ckeditor/ckeditor5-paragraph'
import { Heading } from '@ckeditor/ckeditor5-heading'
import { List } from '@ckeditor/ckeditor5-list'
import { Link } from '@ckeditor/ckeditor5-link'
import { SourceEditing } from '@ckeditor/ckeditor5-source-editing'

export default class CustomEditor extends ClassicEditor {}

CustomEditor.builtinPlugins = [
  Essentials,
  Bold,
  Italic,
  Paragraph,
  Heading,
  List,
  Link,
  SourceEditing,
]

CustomEditor.defaultConfig = {
  toolbar: [
    'heading',
    '|',
    'bold',
    'italic',
    'link',
    'bulletedList',
    'numberedList',
    '|',
    'sourceEditing'
  ],
  language: 'en',
}
