import { Link } from "react-router-dom";
export default function CreatePost() {
  return (
    <div className="p-4">
      <div>
        <Link to="/createUserPost">create user post</Link>
      </div>
      <Link to="/createProductPost">create product post</Link>
    </div>
  );
}
