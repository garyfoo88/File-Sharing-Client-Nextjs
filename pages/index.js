import styles from "../styles/Home.module.css";
import { Grid, Button, Modal, Snackbar } from "@material-ui/core";
import { FileDrop } from "react-file-drop";
import sjcl from "sjcl";
import axios from "axios";
export default function Home() {
  const handleFileDrop = async (file) => {
    const fileName = file.name;
    const fileType = file.type;
    const fileSize = file.size;
    const password = "";
    const daysToDelete = 0;

    const oFReader = new FileReader();
    oFReader.readAsDataURL(file);
    console.log(file);

    oFReader.onload = async function (oFREvent) {
      const key = await sjcl.codec.base64.fromBits(
        sjcl.random.randomWords(8, 10),
        0
      );
      const encryptedFile = await sjcl.encrypt(key, oFREvent.target.result);
      const parseEncrypted = await JSON.parse(encryptedFile);
      console.log(parseEncrypted);

      axios
        .post("http://localhost:3001/document/upload", {
          file_name: fileName,
          file_type: fileType,
          days_to_delete: daysToDelete,
          password: password,
          encrypted_file: parseEncrypted,
          file_size: fileSize,
        })
        .then(({ data }) => {
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
  };

  return (
    <div className={styles.container}>
      <FileDrop
        className="Dropzone"
        onDrop={(files, event) => console.log(files)}
      >
        <div className="center">
          <h3> Drag and drop the files here</h3>
          <div className="imageUpload">
            <input
              style={{ display: "none" }}
              id="contained-button-file"
              onChange={(e) => handleFileDrop(e.target.files[0])}
              type="file"
              accept="application/pdf"
            />
            <label htmlFor="contained-button-file">
              <Button
                variant="contained"
                component="span"
                className="choose-file-button"
              >
                Choose Files
              </Button>
            </label>
          </div>
        </div>
      </FileDrop>
    </div>
  );
}
