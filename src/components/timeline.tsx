import {
  collection,
  // getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { styled } from "styled-components";
import { db } from "../firebase";
import Tweet from "./tweet";
import { Unsubscribe } from "firebase/auth";

export interface ITweet {
  id: string;
  photo?: string;
  tweet: string;
  userId: string;
  username: string;
  createdAt: number;
}

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  overflow-y: scroll;
`;

export default function Timeline() {
  const [tweets, setTweet] = useState<ITweet[]>([]);

  const handleScroll = (e) => {
    const target = e.target;
    const bottomPos = target.clientHeight + target.scrollTop;
    if (target.scrollHeight <= bottomPos) {
      console.log("scroll end");
    }
  }
  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchTweets = async () => {
      const tweetsQuery = query(
        collection(db, "tweets"),
        orderBy("createdAt", "desc"),
        limit(10)
      );
      /* const spanshot = await getDocs(tweetsQuery);
        const tweets = spanshot.docs.map((doc) => {
          const { tweet, createdAt, userId, username, photo } = doc.data();
          return {
            tweet,
            createdAt,
            userId,
            username,
            photo,
            id: doc.id,
          };
        }); */
      // onSanpshot return으로 구독취소 함수를 준다.
      unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {
        const tweets = snapshot.docs.map((doc) => {
          const { tweet, createdAt, userId, username, photo } = doc.data();
          return {
            tweet,
            createdAt,
            userId,
            username,
            photo,
            id: doc.id,
          };
        });
        setTweet(tweets);
      });
    };
    fetchTweets();
    // useEffect가 teardown or clenup을 실시할 때 return 한다.
    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);
  return (
    <Wrapper onScroll={handleScroll}>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  );
}
