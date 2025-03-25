import { Button, Form, Input, message, Select, Switch, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { checkImage } from "../../helper/checkImage";
import { processThumbnail } from "../../helper/processThumbnail";
import { getRoles } from "../../services/rolesServices";
import { editAccount, getDetailAccount } from "../../services/accountServices";
import useAuth from "../../helper/useAuth";

function EditAccount() {
    const [form] = Form.useForm();
    const [data, setData] = useState({});
    const params = useParams();
    const [roles, setRoles] = useState([]);

    const permissions = useAuth();

    const fetchAPIRole = async () => {
        const result = await getRoles();
        setRoles(result.roles);
    };

    const fetchAPIAccount = async () => {
        const result = await getDetailAccount(params.id);
        setData(result.account);
    };

    useEffect(() => {
        fetchAPIRole();
        fetchAPIAccount();
    }, []);

    const rolesOption = [
        {
            label: "-- Chọn quyền --",
            value: "",
            disabled: true
        },
        ...roles.map(role => ({
            value: role._id,
            label: role.title
        }))
    ];

    if (Object.keys(data).length > 0) {
        if (data.status === "active") {
            data.status = true;
        } else if (data.status === "inactive") {
            data.status = false;
        };
    };

    useEffect(() => {
        const formInitialValues = async () => {
            if (Object.keys(data).length > 0) {
                form.setFieldsValue({
                    fullName: data.fullName || "",
                    status: data.status || false,
                    avatar: await processThumbnail(data.avatar),
                    role_id: data.role_id || "",
                    email: data.email,
                    phone: data.phone
                });
            };
        };

        formInitialValues();
    }, [data]);

    const handleSubmit = async (data) => {
        const formData = new FormData();

        for (const key in data) {
            if (key === "avatar") {
                if (data[key].length > 0) {
                    formData.append("avatar", data.avatar[0].originFileObj);
                } else {
                    formData.append("avatar", "");
                }
            } else if (key === "status") {
                if (data[key]) {
                    formData.append("status", "active");
                } else {
                    formData.append("status", "inactive");
                }
            } else if (key === "password") {
                if (data[key]) {
                    formData.append(key, data[key]);
                } else {
                    formData.append(key, "");
                };
            } else {
                formData.append(key, data[key]);
            };
        };

        const result = await editAccount(params.id, formData);
        if (result.code === 200) {
            message.success("Cập nhật tài khoản thành công!");
        } else {
            message.error("Cập nhật tài khoản thất bại!");
        }
    };
    return (
        <>
            {permissions.includes("accounts_edit") && (
                <div className="accounts__edit">
                    <Form
                        className="accounts__form"
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                    >
                        <div className="accounts__header">
                            <h5 className="accounts__title">
                                Chỉnh sửa thông tin
                            </h5>

                            <div className="accounts__buttons">
                                <Form.Item className="accounts__form-item">
                                    <Button type='primary' htmlType="submit">Cập nhật</Button>
                                </Form.Item>
                            </div>
                        </div>

                        <div className="accounts__input-data">
                            <Form.Item
                                label="Họ tên"
                                name="fullName"
                                rules={[
                                    {
                                        required: true,
                                        message: "Họ tên không thể bỏ trống!"
                                    }
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    {
                                        type: 'email',
                                        required: true,
                                        message: "Email không thể bỏ trống!"
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                label="Mật khẩu"
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item
                                label="Xác nhận mật khẩu"
                                name='confirm-password'
                                dependencies={["password"]}
                                rules={[
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            const password = getFieldValue("password");

                                            // Nếu không có mật khẩu thì không yêu cầu xác nhận
                                            if (!password) {
                                                return Promise.resolve();
                                            }

                                            // Nếu có mật khẩu mà không nhập xác nhận
                                            if (!value) {
                                                return Promise.reject(new Error("Vui lòng nhập xác nhận mật khẩu!"));
                                            }

                                            // Nếu mật khẩu và xác nhận không khớp
                                            return password === value
                                                ? Promise.resolve()
                                                : Promise.reject(new Error("Mật khẩu không khớp!"));
                                        }
                                    })
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item
                                label="Số điện thoại"
                                name="phone"
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item label="Ảnh" name="avatar" valuePropName="fileList" getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList || []}>
                                <Upload action={`http://localhost:3001/api/accounts/edit/${params.id}`} listType="picture-card" maxCount={1} name="avatar" accept="image/*" beforeUpload={(file) => checkImage(file, Upload)}>
                                    <button
                                        style={{
                                            color: 'inherit',
                                            cursor: 'inherit',
                                            border: 0,
                                            background: 'none',
                                        }}
                                        type="button"
                                    >
                                        <PlusOutlined />
                                        <div
                                            style={{
                                                marginTop: 8,
                                            }}
                                        >
                                            Upload
                                        </div>
                                    </button>
                                </Upload>
                            </Form.Item>

                            <Form.Item
                                label="Phân quyền"
                                name="role_id"
                            >
                                <Select options={rolesOption} />
                            </Form.Item>

                            <Form.Item
                                label="Trạng thái"
                                name="status"
                                valuePropName="checked"
                            >
                                <Switch
                                    checkedChildren="Hoạt động"
                                    unCheckedChildren="Dừng hoạt động"
                                />
                            </Form.Item>
                        </div>
                    </Form>
                </div>
            )}
        </>
    );
};

export default EditAccount;