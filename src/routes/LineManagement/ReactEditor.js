import React, { Component } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
// import draftToHtml from 'draftjs-to-html';
// import htmlToDraft from 'html-to-draftjs';
import {BaseUrl,BaseImageUrl} from './../../services/BaseUrl'

const rawContentState = {"entityMap":{"0":{"type":"IMAGE","mutability":"MUTABLE","data":{"src":"http://i.imgur.com/aMtBIep.png","height":"auto","width":"100%"}}},"blocks":[{"key":"9unl6","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"95kn","text":" ","type":"atomic","depth":0,"inlineStyleRanges":[],"entityRanges":[{"offset":0,"length":1,"key":0}],"data":{}},{"key":"7rjes","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}]};

class Hemers extends Component {
  state = {
    editorContent: undefined,
    contentState: rawContentState,
    editorState: '',
  };

  componentWillMount(){
    // this.setData();
  };

  onEditorChange = (editorContent) => {
    this.setState({ editorContent,});
    //this.props.onEditChange(this.props.id,draftToHtml(editorContent));
  };

  clearContent = () => {
    this.setState({
      contentState: '',
    });
  };

  setData(){//这里是技术难点,跟文档写的有差异,是个很大的坑
    if (this.props.value) {
      const contentBlock = htmlToDraft(this.props.value);
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks,
        contentBlock.entityMap,
      );
      const editorState = EditorState.createWithContent(contentState);
      this.setState({editorState});
    }
  };

  onContentStateChange = (contentState) => {
    console.log('contentState', contentState);
  };

  onEditorStateChange = (editorState) => {
    this.setState({editorState});
  };

  imageUploadCallBack = file => new Promise(
    (resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', BaseUrl+"/image/upload");
      // xhr.setRequestHeader('Authorization', 'Client-ID 8d26ccd12712fca');这段好像是加验证
      const data = new FormData();
      data.append('image', file);
      data.append('type', 7);
      data.append('routeId', 6);
      xhr.send(data);
      xhr.addEventListener('load', () => {
        const response = JSON.parse(xhr.responseText);
        // console.log(".....",response);
        // const text = BaseImageUrl+response.files[0].relativeUrl;原先样式
        var res = response.files[0];
        var name = decodeURIComponent(res.name);//name是编码状态 避免中文字符
        var url = res.relativeUrl;
        var lastUrl= url.slice(0,url.lastIndexOf('/')+1)+name;

        const text = BaseImageUrl+lastUrl;
        resolve({ data: { link: text } });  //resolve里面要传入一个{data: { link: url }} url是图片的地址
      });
      xhr.addEventListener('error', () => {
        const error = JSON.parse(xhr.responseText);
        reject(error);
      });
    }
  );

  render() {
    const { editorContent, editorState } = this.state;
    return (
      <div className="gutter-example button-demo">
        <Editor
          editorState={editorState}
          toolbarClassName="home-toolbar"
          wrapperClassName="home-wrapper"
          editorClassName="home-editor"
          onEditorStateChange={this.onEditorStateChange}
          toolbar={{
            history: { inDropdown: true },
            inline: { inDropdown: false },
            list: { inDropdown: true },
            textAlign: { inDropdown: true },
            fontSize: {
              icon: 18,
              options: [10,12, 14, 16, 18, 24, 30, 36, 48, 60],
            },
            fontFamily: {
              options: ['Microsoft YaHei','SimHei','SimSun','STHeiti','STFangsong','STKaiti','Arial', 'Georgia', 'Impact', 'Tahoma', 'Roboto', 'Times New Roman', 'Verdana'],
            },
            image: {
              uploadCallback: this.imageUploadCallBack,
              defaultSize: {
                height: 'auto',
                width: '100%',
              }
            },
          }}
          onContentStateChange={this.onEditorChange}
          placeholder=""
          spellCheck
          // onFocus={() => {console.log('focus')}}
          // onBlur={() => {console.log('blur')}}
          //onTab={() => {console.log('tab'); return true;}}
          localization={{ locale: 'zh', translations: {'generic.add': '添加'} }}
          mention={{
            separator: ' ',
            trigger: '@',
            caseSensitive: true,
            suggestions: [
              { text: 'A', value: 'AB', url: 'href-a' },
              { text: 'AB', value: 'ABC', url: 'href-ab' },
              { text: 'ABC', value: 'ABCD', url: 'href-abc' },
              { text: 'ABCD', value: 'ABCDDDD', url: 'href-abcd' },
              { text: 'ABCDE', value: 'ABCDE', url: 'href-abcde' },
              { text: 'ABCDEF', value: 'ABCDEF', url: 'href-abcdef' },
              { text: 'ABCDEFG', value: 'ABCDEFG', url: 'href-abcdefg' },
            ],
          }}
        />
        <style>{`.home-editor {min-height: 400px;max-height:800px}`}</style>
      </div>
    );
  }
}

export default Hemers;
