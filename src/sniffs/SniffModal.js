import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';
import DataManager from '../modules/DataManager'

const SniffModal = (props) => {
  const {
    buttonLabel = "Make Sniff",
    className
  } = props;

  const [modal, setModal] = useState(false);
  const [sniff, setSniff] = useState("")
  const [sniffLength, setSniffLength] = useState(0)

  const toggle = () => setModal(!modal);

  const getSniffText = (evt) => {
    setSniff(evt.target.value)
    setSniffLength(evt.target.value.length)
  }

  const makeSniff = () => {
    if (sniff !== "" && sniffLength <= 140) {
      DataManager.post("sniffs", {body: sniff, userId: parseInt(sessionStorage.getItem("userId")), timestamp: Date.now()})
      .then(() => {
        toggle()
        window.location.reload()
      })
    }
  }

  return (
    <div>
      <Button color="primary" className={props.calledFrom === "feed" ? "newSniffOnFeed" : null} onClick={toggle}>{buttonLabel}</Button>
      <Modal isOpen={modal} toggle={toggle} className={className}>
        <ModalHeader toggle={toggle}>New Sniff</ModalHeader>
        <ModalBody>
          <Input onChange={getSniffText} type="textarea"></Input>
          <p id={sniffLength > 140 ? "tooMuch" : ""}>{sniffLength}/140{sniffLength > 140 ? " Sniff must be 140 characters or less" : ""}</p>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={makeSniff}>Sniff</Button>{' '}
          <Button color="secondary" onClick={toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default SniffModal;