const { ResponseHelper } = require("../../helpers");
const { HistoryService } = require("../../services");

const accountHistory = (req, res) => {
  try {
    const { userId } = req.user;
    const { accountNo } = req.params;

    HistoryService.checkHistory(userId, accountNo).then((history) => {
      if (!history) {
        return res
        .status(400)
        .json(
          ResponseHelper.responseMessage({}, "Can't retreive history", false)
        );
      }
      return res.status(200).json(ResponseHelper.responseMessage(history, `success`, true));
    });
  } catch (error) {
    return res.status(500).json(ResponseHelper.responseMessage({}, `${error}`, false));
  }
};

module.exports = { accountHistory };
