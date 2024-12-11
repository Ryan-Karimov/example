import { Request, Response } from 'express';
import fs from "fs";
import { checkEmailExistence } from 'advanced-email-existence';
import { ProjectDB } from './db'
import { db } from '../../../../db';
import { FileState } from '../../../../files/schema';
import { Tables } from '../../../../config/tables';
import { FIleDB } from './apps/files/db';
import path from 'path';

export class ProjectService {
    static async getWorkspaceProjects(_req: Request, _res: Response): Promise<void> {
        const { id } = _req.params;
        const { limit, offset, type } = _req.query;

        const result = await ProjectDB.getProjects([id, limit, offset, type]);
        const count = result.length;
        _res.status(200).json({
            message: 'Project list retrieved successfully',
            count,
            data: result
        });
    };

    static async createProject(_req: Request, _res: Response): Promise<void> {
        const { id } = _req.params;
        const { title, current_price, type_id } = _req.body;

        const titleExists = await ProjectDB.checkTitleExists([id, title]);
        if (titleExists) {
            _res.status(400).json({
                message: 'A project with this name already exists'
            });
            return;
        }

        const createdProject = await ProjectDB.createProject([id, title, current_price, type_id]);
        const project = await ProjectDB.getProjectById([id, createdProject[0].id])

        _res.status(201).json({
            message: 'Project created successfully',
            data: project
        });
        return;
    };

    static async updateProject(_req: Request, _res: Response): Promise<void> {
        const { id, projectId } = _req.params;
        const { title, current_price } = _req.body;

        const titleExists = await ProjectDB.checkTitleExistsForUpdate([id, title, projectId]);
        if (titleExists) {
            _res.status(400).json({
                message: 'A project with this name already exists'
            });
            return;
        }

        await ProjectDB.updateProject([id, projectId, title, current_price]);
        _res.status(200).json({
            message: 'Project updated successfully'
        });
    };

    static async deleteProject(_req: Request, _res: Response): Promise<void> {
        const { id, projectId } = _req.params;

        await ProjectDB.deleteProject([id, projectId]);
        _res.status(200).json({
            message: 'Project deleted successfully'
        });
    };

    static async getProjectById(_req: Request, _res: Response): Promise<void> {
        const { id, projectId } = _req.params;

        const result = await ProjectDB.getProjectById([id, projectId]);
        _res.status(200).json({
            message: 'Project retrieved successfully',
            data: result[0]
        });
    };

    static async addUserToProject(_req: Request, _res: Response): Promise<void> {
        _res.status(200).json({
            message: 'Successful'
        });
    }

    static async getFileCountByStatus(_req: Request, _res: Response): Promise<void> {
        const { id, projectId } = _req.params;

        const result = await ProjectDB.getFilesCountByProject([id, projectId]);
        _res.status(200).json({
            message: 'Files count by project retrieved successfully',
            data: result[0]
        });
        return;
    }

    static async getUsersNotInProject(_req: Request, _res: Response): Promise<void> {
        const { id, projectId } = _req.params;

        const result = await ProjectDB.getUsersNotInProject([id, projectId]);
        _res.status(200).json({
            message: 'Successfully retrieved list of users not in the project',
            data: result
        });
        return;
    }

    static async checkEmail(_req: Request, _res: Response): Promise<void> {
        const { id, projectId } = _req.params;
        const { email } = _req.body;

        const isExistsEmail = await ProjectDB.getUserByProject([id, projectId, email]);
        if (isExistsEmail.length !== 0) {
            _res.status(409).json({ message: 'A user with the same email address already exists!' });
            return;
        }

        const checkEmail = await checkEmailExistence(email);
        if (!checkEmail.valid) {
            _res.status(400).json({ message: 'Email does not exist or is invalid!' });
            return;
        }

        _res.status(200).json({
            message: 'The email address is valid and available for use in the project'
        });
        return;
    }

    static async addUsers(_req: Request, _res: Response): Promise<void> {
        const { id, projectId } = _req.params;
        const { email, role_id, users } = _req.body;

        await ProjectDB.addUsersToProject([users, projectId, role_id]);
        _res.status(201).json({
            message: 'Users were successfully added to the project'
        });
        return;
    }

    static async mergingProjects(_req: Request, _res: Response): Promise<void> {
        const { id: workspace_id } = _req.params;
        const userId = _req.user.id;
        const { title, type_id, current_price, project_ids: projectIds } = _req.body;

        let referenceProjectTypeId: number | undefined = undefined;
        const role = await db.fetch(Tables.roles, { title: 'MODERATOR' });
        const titleExists = await db.fetch(Tables.projects, { title: title, workspace_id: workspace_id });
        if (titleExists.length > 0) {
            _res.status(409).json({
                message: `A project with the title "${title}" already exists in the workspace`,
            });
            return;
        };

        try {
            await db.transaction(async (client) => {
                for (const project_id of projectIds) {
                    const projects = await db.fetch(Tables.projects, { id: project_id, is_active: true }, client);
                    if (projects.length === 0) {
                        throw new Error(`Project with ID ${project_id} not found or inactive`);
                    }

                    const project = projects[0];
                    const { type_id: currentProjectTypeId } = project;

                    if (referenceProjectTypeId === undefined) {
                        referenceProjectTypeId = currentProjectTypeId;
                    } else if (currentProjectTypeId !== referenceProjectTypeId) {
                        throw new Error(`Project type mismatch. Expected type: ${referenceProjectTypeId}, but found type: ${currentProjectTypeId}`);
                    }

                    const workspaces = await db.fetch(Tables.workspaces, { id: workspace_id }, client);
                    if (workspaces.length === 0) {
                        throw new Error(`Workspace with ID ${workspace_id} not found`);
                    }

                    const { owner_id: workspaceOwnerId } = workspaces[0];
                    if (workspaceOwnerId !== userId) {
                        throw new Error(`User does not have permission to modify this workspace`);
                    }

                    const doneFile = await db.fetch(Tables.files, { project_id: project_id, state: FileState.DONE }, client);
                    console.log(doneFile);
                    if (doneFile.length === 0) {
                        throw new Error(`No completed file found for project with ID ${project_id}`);
                    }
                }

                const newProject = await db.insert(
                    Tables.projects,
                    { title, current_price, workspace_id, type_id },
                    client
                );

                const userProject = await db.insert(
                    Tables.user_projects,
                    { user_id: userId, project_id: newProject.id, role_id: role[0].id },
                    client
                );

                const files = await FIleDB.mergeProjects(projectIds);
                const destination = path.join(process.cwd(), "uploads");
                const projectFolder = path.join(destination, "projects", String(newProject.id));

                if (!fs.existsSync(projectFolder)) {
                    fs.mkdirSync(projectFolder);
                }

                const classMap = new Map();
                let classOrder = 0;

                if (referenceProjectTypeId !== 3) {
                    for (const projectId of projectIds) {
                        const classes = await db.fetch(Tables.classes, { project_id: projectId }, client);

                        for (const cls of classes) {
                            if (!classMap.has(cls.title)) {
                                const newClass = await db.insert(
                                    Tables.classes,
                                    {
                                        class_order: classOrder++,
                                        title: cls.title,
                                        color: cls.color,
                                        project_id: newProject.id
                                    },
                                    client
                                );
                                classMap.set(cls.title, newClass.id);
                            }
                        }
                    }
                }

                for (let i = 0; i < files.length; i++) {
                    const fileExtension = files[i].file_url.split('.').pop();
                    const newFileName = `${i}.${fileExtension}`;
                    const sourceFilePath = path.join(process.cwd(), 'uploads', 'projects', files[i].project_id, files[i].file_url);
                    const destinationFilePath = path.join(projectFolder, newFileName);

                    if (fs.existsSync(sourceFilePath)) {
                        await fs.promises.copyFile(sourceFilePath, destinationFilePath);
                    }

                    files[i].confirmUserId = userProject.id;
                    files[i].projectId = newProject.id;
                    files[i].fileUrl = newFileName;

                    const newFile = await db.insert(
                        Tables.files,
                        {
                            project_id: files[i].projectId,
                            filename: files[i].filename,
                            file_url: files[i].fileUrl,
                            file_type: files[i].file_type,
                            state: FileState.DONE,
                            preview_url: files[i].preview_url
                        },
                        client
                    );

                    await db.insert(
                        Tables.user_drawed_images,
                        {
                            file_id: newFile.id,
                            draw_user_id: files[i].draw_user_id,
                            price_on_submit: files[i].price_on_submit,
                            drawed_at: files[i].drawed_at,
                            confirm_user_id: files[i].confirmUserId,
                            confirmed_at: files[i].confirmed_at
                        },
                        client
                    );

                    if (referenceProjectTypeId !== 3) {
                        await db.insert(
                            Tables.file_metadata,
                            {
                                file_id: newFile.id,
                                class_id: classMap.get(files[i].metadata[0].title),
                                metadata: files[i].metadata.meta,
                                width: files[i].metadata.width,
                                height: files[i].metadata.height
                            },
                            client
                        );
                    }
                }
            });

            _res.status(200).json({
                message: 'Projects merged successfully'
            });
        } catch (error) {
            if (error instanceof Error) {
                let statusCode = 400;
                let clientMessage = error.message;

                if (error.message.includes('not found')) {
                    statusCode = 404;
                } else if (error.message.includes('permission')) {
                    statusCode = 403;
                } else if (error.message.includes('mismatch')) {
                    statusCode = 422;
                } else if (error.message.includes('already exists')) {
                    statusCode = 409;
                }

                _res.status(statusCode).json({
                    message: clientMessage,
                });
            } else {
                _res.status(500).json({
                    message: 'Unknown error occurred.',
                });
            }
        }
    }
}
