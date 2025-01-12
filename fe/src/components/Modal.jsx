const Modal = ({
  show,
  onClose,
  onConfirm,
  verificationCode,
  setVerificationCode,
  loading,
  loadingConfirm,
}) => {
  if (!show) return null;

  const handleConfirm = () => {
    onConfirm(verificationCode);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
        {loadingConfirm ? (
          <div className="flex flex-col gap-3">
            <p>Loading, Please Wait!</p>
            <div className="w-6 h-6 border-4 border-t-black rounded-full border-gray-300 animate-spin"></div>
          </div>
        ) : (
          <>
            <h2 className="text-lg font-bold mb-4">
              We have sent a verify code to your email!
            </h2>
            <h2 className="text-lg font-bold mb-4">
              Please enter Verification Code
            </h2>
            {loading ? (
              <p className="text-lg mb-4">Loading...</p>
            ) : (
              <input
                type="text"
                placeholder="Enter verification code"
                className="border border-gray-300 rounded py-2 px-3 w-full mb-4"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)} // Lưu mã vào state
              />
            )}

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
          </>
        )}
      </div>
    </div>
  );
};

export default Modal;
