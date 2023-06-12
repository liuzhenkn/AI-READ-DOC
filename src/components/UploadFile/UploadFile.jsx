import {useState} from 'react';
import { InboxOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Upload, Popover, message} from 'antd';
import http from '../../http';
import styles from './UploadFile.module.css';

const { Dragger } = Upload;

const UploadFile = (props) => {
  const navigate = useNavigate();
  const { indexInfo, sizeLimit } = props;
  const { index_id: id, upload_token: token } = indexInfo || {}
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false)

  // 这里有变动本来是可以上传多个文件，现在改成上传一个文件就解析，先简单改造
  const handleChange = ({ fileList }) => {
    if (!fileList.length) {
      setFileList([]);
      return;
    }

    if (fileList[0].size > sizeLimit) return

    setUploading(fileList.some(file => file.status === "uploading"))
    setFileList([...fileList]);

    if (fileList.some(file => file.status === "done")) {
      const name = fileList[0].name.slice(0, fileList[0].name.lastIndexOf('.'));
      http.post('/api/index/create', {index_id: id, index_name: name})
        .then(() => {
          props.fetchHistory()
          navigate(`/chat/${id}`)
        }).catch(x => x)
    }
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
    if (!id) return false
    if (file.size > sizeLimit) {
      message.error(`File size must be smaller than ${sizeLimit / (1024 * 1024)}MB!`);
      return false;
    }
    file.url = token.dir + file.name;
    return file;
  };

  const uploadProps = {
    name: 'file',
    multiple: false,
    listType: "picture",
    style: {borderRadius: 0, borderTop: 'none'},
    accept: ".ppt,.docx,.jpg,.jpeg,.png,mp3,.pdf",
    action: token?.host,
    fileList: fileList,
    maxCount: 1,
    data: getExtraData,
    onChange: handleChange,
    onRemove,
    beforeUpload,
    disabled: !indexInfo || uploading,
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
          Support Doc format: PDF, PPT, DOCX, JPG|JPEG|PNG{
            <Popover
              content={
                <p style={{ maxWidth: '300px' }}>
                  Please note that we will use OCR technology to extract text from the uploaded image for the purpose of your inquiry.
                  Please ensure that the image you upload contains sufficient text.
                </p>
              }
              title=""
            >
              <QuestionCircleOutlined style={{ marginLeft: '3px' }} />
            </Popover>
          }, MP3
        </p>
      </Dragger>
    </div>
  );
}

export default UploadFile;
