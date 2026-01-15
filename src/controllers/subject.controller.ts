import { and, desc, eq, getTableColumns, ilike, or, sql } from "drizzle-orm";
import express from "express"
import { departments, subjects } from "../db/schema";
import { db } from "../db";

export const subjectRetrieval = async (req: express.Request, res: express.Response) => {
    try {
        const { search, department, page = 1, limit = 10 } = req.query;

        const currentPage = Math.max(1, +page);
        const limitPerPage = Math.max(1, +limit);

        const offset = (currentPage -1) * limitPerPage;

        const filterConditions = [];

        //If search query is provided, filter by subject name OR subject code
        if(search) {
            filterConditions.push(
                or(
                    ilike(subjects.name, `%${search}%`),
                    ilike(subjects.code, `%${search}%`)
                )
            );
        }

        //If department filter exists, match department name
        if(department) {
            filterConditions.push(
                ilike(departments.name, `%${department}%`)
            );
        }

        //Combine all filters using AND if any exist
        const whereClause = filterConditions.length > 0 ? and(...filterConditions) : undefined;

        const countResult = await db
            .select({ count: sql<number> `count(*)`})
            .from(subjects)
            .leftJoin(departments, eq(subjects.departmentId, departments.id))
            .where(whereClause);
            
        const totalCount = countResult[0]?.count ?? 0;

        const subjectList = await db
            .select({
                ...getTableColumns(subjects),
                department: { ...getTableColumns(departments) }
            })
            .from(subjects)
            .leftJoin(departments, eq(subjects.departmentId, departments.id))
            .where(whereClause)
            .orderBy(desc(subjects.createdAt))
            .limit(limitPerPage)
            .offset(offset);

            return res.status(200).json({
                data: subjectList,
                pagination: {
                    page: currentPage,
                    limit: limitPerPage,
                    totalItems: totalCount,
                    totalPages: Math.ceil(totalCount / limitPerPage),
                }
            });
    } catch (err) {
        console.error("Error fetching subjects:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}


