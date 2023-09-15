import classes from "./Signup.module.css";

const Signup = () => {
  return (
    <section className={classes.container}>
      <div className={classes.main}>
        <h1>CREATE AN ACCOUNT</h1>
        <form>
          <div className={classes.formControl}>
            <input type="text" placeholder="User Name" />
          </div>
          <div className={classes.formControl}>
            <input type="email" placeholder="Email" />
          </div>
          <div className={classes.formControl}>
            <input type="tel" placeholder="Phone Number" />
          </div>
          <div className={classes.formControl}>
            <input type="password" placeholder="Password" />
          </div>
          <button>CREATE</button>
        </form>
        <div className={classes.toggle}>
          Already have an Account ? <span>Sign In</span>
        </div>
      </div>
    </section>
  );
};

export default Signup;
