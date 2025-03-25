import { Button, Form, Input, message } from "antd";
import { Editor } from '@tinymce/tinymce-react';
import { handlePickerCallback } from "../../helper/handlePickerCallback";
import './Roles.scss';
import { useEffect, useRef, useState } from "react";
import { createRoles, editRole, getDetailRole, permissions } from "../../services/rolesServices";
import { useParams } from "react-router-dom";
import useAuth from "../../helper/useAuth";

function EditRole() {
    const [form] = Form.useForm();
    const editorRef = useRef(null);
    const [data, setData] = useState({});
    const params = useParams();

    const permissions = useAuth();

    const fetchAPI = async () => {
        const result = await getDetailRole(params.id);
        setData(result.role);
    };

    useEffect(() => {
        fetchAPI();
    }, []);

    useEffect(() => {
        const formInitialValues = () => {
            if (Object.keys(data).length > 0) {
                form.setFieldsValue({
                    title: data.title || ""
                });
            }
        }

        formInitialValues();
    }, [data]);

    const handleSubmit = async (data) => {
        if (editorRef.current.getContent()) {
            data["description"] = editorRef.current.getContent();
        } else {
            data["description"] = "";
        };

        const result = await editRole(params.id, data);
        if (result.code === 200) {
            message.success("Cập nhật nhóm quyền thành công!");
        } else {
            message.success("Cập nhật nhóm quyền thất bại!");
        }
    };

    return (
        <>
            {permissions.includes("roles_edit") && (
                <div className="roles__edit">
                    <Form
                        form={form}
                        layout="vertical"
                        className="roles__form"
                        onFinish={handleSubmit}
                    >
                        <div className="roles__header">
                            <h5 className="roles__title">
                                Cập nhật nhóm quyền
                            </h5>

                            <div className="roles__buttons">
                                <Form.Item className="roles__form-item">
                                    <Button type='primary' htmlType="submit">Cập nhật</Button>
                                </Form.Item>
                            </div>
                        </div>

                        <div className="roles__input-data">
                            <Form.Item
                                label="Tiêu đề nhóm quyền"
                                name="title"
                            >
                                <Input />
                            </Form.Item>

                            <div className="roles__desc">
                                <label className="roles__label-desc">Mô tả nhóm quyền</label>
                                <Editor
                                    apiKey='vcbgfqutgjbvv0cl9kdsjylyti5d6xq99x8gkrigm9jg62u4'
                                    onInit={(_evt, editor) => editorRef.current = editor}
                                    init={{
                                        plugins: [
                                            // Core editing features
                                            'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount', 'code',
                                            // Your account includes a free trial of TinyMCE premium features
                                            // Try the most popular premium features until Mar 29, 2025:
                                            'checklist', 'mediaembed', 'casechange', 'export', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'editimage', 'advtemplate', 'ai', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown', 'importword', 'exportword', 'exportpdf'
                                        ],
                                        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | addcomment showcomments | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                                        tinycomments_mode: 'embedded',
                                        tinycomments_author: 'Author name',
                                        mergetags_list: [
                                            { value: 'First.Name', title: 'First Name' },
                                            { value: 'Email', title: 'Email' },
                                        ],
                                        ai_request: (request, respondWith) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
                                        file_picker_callback: handlePickerCallback
                                    }}
                                    initialValue={data.description || ""}
                                />
                            </div>
                        </div>
                    </Form>
                </div>
            )}
        </>
    );
};

export default EditRole;