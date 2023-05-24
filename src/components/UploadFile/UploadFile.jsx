import {useState} from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Upload, Button } from 'antd';
import http from '../../http';
import styles from './UploadFile.module.css';

const { Dragger } = Upload;

const UploadFile = (props) => {
  const navigate = useNavigate();
  const { indexInfo } = props;
  const { index_id: id, upload_token: token } = indexInfo
  const [fileList, setFileList] = useState([]);

  const handleChange = ({ fileList }) => {
    setFileList([...fileList]);
  };

  const onRemove = (file) => {
    const files = (fileList || []).filter((v) => v.url !== file.url);
    setFileList(files);
  };

  const getExtraData = (file) => ({
    key: file.url,
    OSSAccessKeyId: token?.accessid,
    policy: token?.policy,
    Signature: token?.signature,
  });

  const beforeUpload = async (file) => {
    if (!id) return false;
    file.url = token.dir + file.name;
    return file;
  };

  const analysis = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!fileList.length) return
    const name = fileList[0].name.slice(0, fileList[0].name.lastIndexOf('.'));
    http.post('/api/index/create', {index_id: id, index_name: name})
      .then(() => {
        props.fetchHistory()
        navigate(`/chat/${id}?init=true`)
      }).catch(x => x)
  }

  const uploadProps = {
    name: 'file',
    multiple: true,
    listType: "picture",
    style: {borderRadius: 0, borderTop: 'none'},
    accept: ".ppt,.docx,.jpg,.png,mp3,.pdf",
    action: token.host,
    fileList: fileList,
    data: getExtraData,
    // disabled: true,
    onChange: handleChange,
    onRemove,
    beforeUpload,
  };

  return (
    <div>
      <h1 className={styles.uploadHeader}>Upload Documents</h1>
      <Dragger {...uploadProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag file to this area to upload</p>
        <p className="ant-upload-hint">
          Support Doc format: PDF, PPT, DOCX, JPG|PNG, MP3
        </p>
        <Button type="primary" onClick={analysis} className={styles.uploadBtn}>Analysis</Button>
      </Dragger>
    </div>
  );
}

export default UploadFile;
