import { styled } from "styled-components";
import { ITweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useState } from "react";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const Column = styled.div`
  &:last-child {
    place-self: end;
  }
`;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;

const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const UpdateButton = styled.button`
  background-color: orange;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TextArea = styled.textarea`
  margin: 10px;
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;

// const AttachFileButton = styled.label`
//   padding: 10px 0px;
//   color: #1d9bf0;
//   text-align: center;
//   border-radius: 20px;
//   border: 1px solid #1d9bf0;
//   font-size: 14px;
//   font-weight: 600;
//   cursor: pointer;
// `;

const SubmitBtn = styled.input`
  background-color: #1d9bf0;
  color: white;
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;

export default function Tweet({ username, photo, tweet, userId, id }: ITweet) {
  const user = auth.currentUser;
  const [editting, setEditting] = useState(false);
  const [tweetIn, setTweetIn] = useState(tweet);
  const [isLoading, setLoading] = useState(false);
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweetIn(e.target.value);
  };

  const onDelete = async () => {
    const ok = confirm("Are you sure you want to delete this tweet?");
    if (!ok || user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, "tweets", id));
      if (photo) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.log(e);
    } finally {
      //
    }
  };
  const onUpdate = async () => {
    try {
      if (editting === true) {
        if (!user || isLoading || tweetIn === "" || tweetIn.length > 180) return;
        setLoading(true);
        await updateDoc(doc(db, "tweets", id), {
          tweet: tweetIn,
          username: username,
          userId: userId
        });
      }
      setEditting(!editting);
      // if (photo) {
      //   const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
      //   await deleteObject(photoRef);
      // }
    } catch (e) {
      console.log(e);
    } finally {
      //
      setLoading(false);
    }
  };
  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        {editting === true ? (
          <Form onSubmit={onUpdate}>
          <TextArea
            required
            rows={5}
            maxLength={180}
            onChange={onChange}
            value={tweetIn}
            placeholder="What is happening?!"
          />
          {/* <SubmitBtn
            type="submit"
            value={isLoading ? "Posting..." : "Change Tweet"}
          /> */}
        </Form>
        ) : <Payload>{tweet}</Payload>}
      
        {user?.uid === userId ? (
          <>
            <UpdateButton onClick={onUpdate}>
              {editting === true ? 'Apply' : 'Edit'}
            </UpdateButton>
            <DeleteButton onClick={onDelete}>Delete</DeleteButton>
          </>
        ) : null}
      </Column>
      <Column>{photo ? <Photo src={photo} /> : null}</Column>
    </Wrapper>
  );
}
