const Modal = ({
  show,
  onClose,
  onConfirm,
  verificationCode,
  setVerificationCode,
}) => {
  if (!show) return null;

  const handleConfirm = () => {
    onConfirm(verificationCode);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
        <h2 className="text-lg font-bold mb-4">
          We have sent a verify code to your email!
        </h2>
        <h2 className="text-lg font-bold mb-4">
          Please enter Verification Code
        </h2>
        <input
          type="text"
          placeholder="Enter verification code"
          className="border border-gray-300 rounded py-2 px-3 w-full mb-4"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)} // Lưu mã vào state
        />
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="bg-gray-300 text-black px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
