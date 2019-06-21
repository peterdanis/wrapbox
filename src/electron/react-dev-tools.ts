import installExtension, {
  REACT_DEVELOPER_TOOLS,
} from "electron-devtools-installer";

interface Logger {
  info: Function;
}

const init = (logger: Logger): void => {
  installExtension(REACT_DEVELOPER_TOOLS)
    .then(name => logger.info(`Added Extension:  ${name}`))
    .catch(err => logger.info("An error occurred: ", err));
};

export default init;
