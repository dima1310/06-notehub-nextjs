import css from "./Loader.module.css";

const Loader = () => {
  return (
    <div className={css.loader}>
      <div className={css.spinner}></div>
      <p>Loading, please wait...</p>
    </div>
  );
};

export default Loader;
