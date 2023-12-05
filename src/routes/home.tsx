import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { Button, Title, Wrapper } from "../components/auth-components";

export default function Home() {
  const navigate = useNavigate();
  const logOut = async () => {
    await auth.signOut();
    navigate("/login");
  };
  return (
    <Wrapper>
    <Title>Here is to be Eden</Title>
    <Button onClick={logOut}>Log Out</Button>
    </Wrapper>
  );
}
