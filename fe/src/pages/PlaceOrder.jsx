import React, { useState, useContext, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";

import Title from "../components/Title";
import Modal from "../components/Modal";
import CartTotal from "../components/CartTotal";
import { requireOrderConfirmationPin, confirmEmail } from "../service/callAPI";
import { ShopContext } from "../context/ShopContext";
import { Form, Input, Select } from "antd";

const PlaceOrder = () => {
    const [method, setMethod] = useState("cod");
    const { navigate } = useContext(ShopContext);
    const cartData = useSelector((state) => state.cart?.cartData || []);
    const userInfo = useSelector((state) => state.account.userInfo);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isLocked, setIsLocked] = useState(false); // Khóa chuyển đổi phương thức thanh toán

    const [formData, setFormData] = useState({
        city: "",
        district: "",
        ward: "",
        stress: "",
        paymentMethod: "COD",
    });

    // Lấy danh sách tỉnh thành
    const [form] = Form.useForm();
    const formRef = useRef(form);

    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [hasDistricts, setHasDistricts] = useState(true);
    const [hasWards, setHasWards] = useState(true);

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await fetch(
                    `https://open.oapi.vn/location/provinces?page=0&size=1000`
                );
                const data = await response.json();
                setCities(data.data);
            } catch (error) {
                console.error("Error fetching provinces:", error);
                toast.error("Failed to load cities");
            }
        };

        fetchProvinces();
    }, []);

    const handleCityChange = async (value) => {
        form.setFieldsValue({
            district: undefined,
            ward: undefined,
        });

        try {
            const response = await fetch(
                `https://open.oapi.vn/location/districts/${value}?page=0&size=1000`
            );
            const data = await response.json();

            if (!data.data || data.data.length === 0) {
                setHasDistricts(false);
                setDistricts([]);
                setWards([]);
                // If there are no districts, automatically set district and ward as "N/A"
                form.setFieldsValue({
                    district: "N/A",
                    ward: "N/A",
                });
            } else {
                setHasDistricts(true);
                setDistricts(data.data);
            }
        } catch (error) {
            console.error("Error fetching districts:", error);
            toast.error("Failed to load districts");
        }
    };

    const handleDistrictChange = async (value) => {
        if (value === "N/A") return;

        form.setFieldsValue({
            ward: undefined,
        });

        try {
            const response = await fetch(
                `https://open.oapi.vn/location/wards/${value}?page=0&size=1000`
            );
            const data = await response.json();

            if (!data.data || data.data.length === 0) {
                setHasWards(false);
                setWards([]);
                // If there are no wards, automatically set ward as "N/A"
                form.setFieldsValue({
                    ward: "N/A",
                });
            } else {
                setHasWards(true);
                setWards(data.data);
            }
        } catch (error) {
            console.error("Error fetching wards:", error);
            toast.error("Failed to load wards");
        }
    };

    const handleFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);

        const errorFields = errorInfo.errorFields;
        if (errorFields && errorFields.length > 0) {
            const firstError = errorFields[0];
            toast.error(firstError.errors[0] || "Please fill in all required fields");

            const errorElement = document.querySelector(`[name="${firstError.name[0]}"]`);
            if (errorElement) {
                errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }
    };

    const [verificationCode, setVerificationCode] = useState(""); // Mã xác nhận

    const handlePaymentMethodChange = (method) => {
        if (isLocked) return; // Nếu đã khóa, không cho phép thay đổi
        setFormData((prevData) => ({
            ...prevData,
            paymentMethod: method,
        }));
    };

    const getCartAmount = () => {
        let total = 0;
        cartData.forEach((item) => {
            Object.entries(item.sizes).forEach(([size, quantity]) => {
                total += item.product.price * quantity;
            });
        });
        return total;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePlaceOrder = async () => {
        try {
            if (formRef.current) {
                formRef.current.submit();
            }

            const values = await formRef.current.validateFields();

            formData.city = cities.find((city) => city.id === values.city).name;
            formData.district = districts.find((district) => district.id === values.district).name;
            formData.ward = wards.find((ward) => ward.id === values.ward).name;
            formData.stress = values.street;

            console.log("formData", formData);

            if (!userInfo) {
                toast.error("Please login to place an order!");
                return;
            }

            if (formData.paymentMethod === "BANKING") {
                setIsLocked(true);
                return;
            }

            const { city, district, ward, street, paymentMethod } = formData;
            const address = { city, district, ward, stress };
            const items = cartData;
            const amount = getCartAmount();

            const orderData = {
                userId: userInfo.id,
                items,
                amount,
                address,
                paymentMethod,
            };

            const response = await axios.post("http://localhost:8080/order/place", orderData, {
                withCredentials: true,
            });

            if (response.data.success) {
                toast.success("Please select a size");
                navigate("/orders");
            } else {
                toast.error("Failed to place order. Please try again.");
            }
        } catch (errorInfo) {
            if (errorInfo && errorInfo.errorFields) {
                // errorInfo.errorFields.forEach((errorField) => {
                //     const fieldName = errorField.name[0];
                //     const errorMessage = errorField.errors[0];
                //     toast.error(`Error in ${fieldName}: ${errorMessage}`);
                // });
            } else {
                toast.error("An unexpected error occurred!");
            }
        }
    };

    // Yêu cầu mã xác nhận
    const requestVerificationCode = async () => {
        await requireOrderConfirmationPin();
    };

    const handleVerifyCode = async () => {
        try {
            const { city, district, ward, stress, paymentMethod } = formData;
            const address = { city, district, ward, stress };
            const amount = getCartAmount();
            const items = cartData;

            const response = await confirmEmail(
                verificationCode, // Mã xác nhận
                items, // Danh sách sản phẩm trong giỏ hàng
                amount, // Tổng tiền
                address, // Địa chỉ giao hàng
                paymentMethod // Phương thức thanh toán
            );

            console.log(response);

            if (response.success) {
                toast.success("Payment confirmed successfully!");
                navigate("/orders");
            } else {
                toast.error("Invalid verification code!");
            }
        } catch (error) {
            toast.error("An error occurred while verifying the payment!");
        }
    };

    const handleCancel = () => {
        setIsLocked(false); // Mở khóa phương thức thanh toán
        setFormData((prevData) => ({
            ...prevData,
            paymentMethod: "COD",
        }));
    };

    return (
        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t">
            {/* left */}
            <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
                <div className="text-xl sm:text-2xl my-3">
                    <Title text1={"DELIVERY "} text2={"INFORMATION"} />
                </div>
                <Form
                    form={form}
                    name="delivery-form"
                    onFinishFailed={handleFinishFailed}
                    layout="vertical"
                    ref={formRef}
                >
                    <div className="flex gap-3">
                        <div className="w-full">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                City <span className="text-red-500">*</span>
                            </label>
                            <Form.Item
                                name="city"
                                className="mb-4"
                                rules={[{ required: true, message: "Please select a city!" }]}
                            >
                                <Select
                                    placeholder="Select a city"
                                    onChange={handleCityChange}
                                    className="w-full"
                                    size="large"
                                >
                                    {cities.map((city) => (
                                        <Select.Option key={city.id} value={city.id}>
                                            {city.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </div>

                        <div className="w-full">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                District <span className="text-red-500">*</span>
                            </label>
                            <Form.Item
                                name="district"
                                className="mb-4"
                                rules={[{ required: true, message: "Please select a district!" }]}
                            >
                                <Select
                                    placeholder="Select a district"
                                    onChange={handleDistrictChange}
                                    disabled={!form.getFieldValue("city")}
                                    className="w-full"
                                    size="large"
                                >
                                    {hasDistricts ? (
                                        districts.map((district) => (
                                            <Select.Option key={district.id} value={district.id}>
                                                {district.name}
                                            </Select.Option>
                                        ))
                                    ) : (
                                        <Select.Option value="N/A">N/A</Select.Option>
                                    )}
                                </Select>
                            </Form.Item>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ward <span className="text-red-500">*</span>
                        </label>
                        <Form.Item
                            name="ward"
                            rules={[{ required: true, message: "Please select a ward!" }]}
                        >
                            <Select
                                placeholder="Select a ward"
                                disabled={!form.getFieldValue("district") || !hasDistricts}
                                className="w-full"
                                size="large"
                            >
                                {hasWards ? (
                                    wards.map((ward) => (
                                        <Select.Option key={ward.id} value={ward.id}>
                                            {ward.name}
                                        </Select.Option>
                                    ))
                                ) : (
                                    <Select.Option value="N/A">N/A</Select.Option>
                                )}
                            </Select>
                        </Form.Item>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Street <span className="text-red-500">*</span>
                        </label>
                        <Form.Item
                            name="street"
                            rules={[
                                { required: true, message: "Please enter your street address!" },
                            ]}
                        >
                            <Input type="text" placeholder="Street" size="large" />
                        </Form.Item>
                    </div>
                </Form>
            </div>
            {/* right */}
            <div className="mt-8">
                <div className="mt-8 min-w-80">
                    <CartTotal />
                </div>
                <div className="mt-12">
                    <Title text1={"PAYMENT "} text2={"CART"} />
                    <div className="flex gap-3 flex-col lg:flex-row">
                        <div
                            onClick={() => handlePaymentMethodChange("BANKING")}
                            className={`flex items-center gap-3 border p-2 px-3 cursor-pointer ${
                                isLocked && formData.paymentMethod !== "BANKING"
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                            }`}
                        >
                            <p
                                className={`w-3.5 h-3.5 border rounded-full ${
                                    formData.paymentMethod === "BANKING" ? "bg-green-400" : ""
                                }`}
                            ></p>
                            <p className="text-gray-500 text-sm font-medium mx-4">BANKING</p>
                        </div>
                        <div
                            onClick={() => handlePaymentMethodChange("COD")}
                            className={`flex items-center gap-3 border p-2 px-3 cursor-pointer ${
                                isLocked ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        >
                            <p
                                className={`w-3.5 h-3.5 border rounded-full ${
                                    formData.paymentMethod === "COD" ? "bg-green-400" : ""
                                }`}
                            ></p>
                            <p className="text-gray-500 text-sm font-medium mx-4">
                                CASH ON DELIVERY
                            </p>
                        </div>
                    </div>

                    <div className="w-full text-end mt-8">
                        {isLocked ? (
                            <div className="flex gap-4">
                                <button
                                    onClick={handleCancel}
                                    className="bg-red-500 text-white px-8 py-3 text-sm"
                                >
                                    CANCEL
                                </button>
                                <button
                                    onClick={() => {
                                        setIsModalVisible(true);
                                        requestVerificationCode();
                                    }}
                                    className="bg-green-500 text-white px-8 py-3 text-sm"
                                >
                                    VERIFY PAYMENT
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handlePlaceOrder}
                                className="bg-black text-white px-16 py-3 text-sm"
                            >
                                CONFIRM ORDER
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal */}
            <Modal
                show={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onConfirm={handleVerifyCode}
                verificationCode={verificationCode}
                setVerificationCode={setVerificationCode}
            />
        </div>
    );
};

export default PlaceOrder;
