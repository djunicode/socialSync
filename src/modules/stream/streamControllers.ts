//createStream, deleteStream , getStream , getStreams , getMyStream , updateStream

import { CreateStreamInput, GetStreamParams , UpdateStreamInput, GetStreamsQuery } from "./streamSchema";
import prisma from "../../utils/prisma";
import { FastifyReply, FastifyRequest } from "fastify";
import { PaginationQuery } from "../../utils/globalSchemas";
import { streamExists } from "../../utils/stream";

// 

export async function createStream(request: FastifyRequest<{ Body: CreateStreamInput }>, reply: FastifyReply) {
    const input = request.body;
    try {
        const stream = await prisma.stream.create({
            data: {
                thumbnailUrl: input.thumbnailUrl,
                startTimestamp: new Date(input.startTimestamp),
                endTimestamp: new Date(input.endTimestamp?input.endTimestamp:input.startTimestamp), // If endTimestamp is not provided, set it to the current date (now)
                storageUrl: input.storageUrl, 
                title: input.title,
                description: input.description,
                tags: input.tags,
                userUserId: request.user.userId 
            }
        });
        return reply.status(200).send(stream);
    } catch (error) {
        console.error("Error creating stream:", error);
        return reply.status(500).send({ error: "Internal Server Error" }); // Respond with a generic error message
    }
}


export async function getMyStream(request: FastifyRequest<{Querystring:PaginationQuery}>, reply: FastifyReply) {
    try {
        const streams = await prisma.stream.findMany({
            take: request.query.limit,
            skip: request.query.limit * (request.query.page),
            where: {
                userUserId: request.user.userId
            }
        })

        return reply.status(200).send(streams);
    } catch (error) {
        console.log(error);
        return reply.status(500).send(error);
    }
}

export async function getStream(request: FastifyRequest<{ Params: GetStreamParams }>, reply: FastifyReply) {
    try {
        const stream = await prisma.stream.findFirst({
            where: {
                streamId: request.params.streamId
            }
        })
        if (!stream) return reply.status(400).send({ error: "stream does not exist" });
        return reply.status(200).send(stream);
    } catch (error) {
        console.log(error);
        return reply.status(500).send(error);
    }
}

export async function getStreams(request: FastifyRequest<{ Querystring: PaginationQuery }>, reply: FastifyReply) {
    try {
        const streams = await prisma.stream.findMany({
            take: request.query.limit,
            skip: request.query.limit * (request.query.page),
            select: {
                streamId:true,
                thumbnailUrl:true,
                startTimestamp:true,
                endTimestamp:true,
                storageUrl:true,
                title:true,
                description:true,
                tags:true,
                userUserId:true
            }
        })
        return reply.status(200).send(streams);
    } catch (error) {
        console.log(error);
        return reply.status(500).send(error);
    }
}

export async function updateStream(request: FastifyRequest<{ Params: {streamId: string },Body: UpdateStreamInput }>, reply: FastifyReply) {
    const input = request.body;
    const streamId = request.params.streamId // Assuming you're passing streamId as a parameter
    try {
        if(!await streamExists(streamId, request.user.userId)) return reply.status(400).send({ error: "stream does not exist" });
        const updatedStream = await prisma.stream.update({
            where: {
                streamId: streamId,
                userUserId: request.user.userId
            },
            data: {
                thumbnailUrl: input.thumbnailUrl,
                startTimestamp: new Date(input.startTimestamp),
                endTimestamp: new Date(input.endTimestamp?input.endTimestamp:input.startTimestamp),
                storageUrl: input.storageUrl,
                title: input.title,
                description: input.description,
                tags: input.tags
            }
        });
        return reply.status(200).send(updatedStream);
    } catch (error) {
        console.error("Error updating stream:", error);
        return reply.status(500).send({ error: "Internal Server Error" });
    }
}

export async function deleteStream(request: FastifyRequest<{ Params: { streamId: string } }>, reply: FastifyReply) {
    const streamId = request.params.streamId;
    try {
        if(!await streamExists(streamId, request.user.userId)) return reply.status(400).send({ error: "stream does not exist" });
        const deletedStream = await prisma.stream.delete({
            where: {
                streamId: streamId,
                userUserId: request.user.userId
            }
        });
        return reply.status(200).send(deletedStream);
    } catch (error) {
        console.error("Error deleting stream:", error);
        return reply.status(500).send({ error: "Internal Server Error" });
    }
}


export async function getMyLikedStreams(request: FastifyRequest<{ Querystring: PaginationQuery }>, reply: FastifyReply) {
    try {
        const votes = await prisma.vote.findMany({
            take: request.query.limit,
            skip: request.query.limit * (request.query.page),
            where:{
                userUserId:request.user.userId,
                dislike:false
            },
            select: {
                streamStreamId:true
            }
        })
        
        const streamIds = votes.map(stream => stream.streamStreamId);
        const streams = await prisma.stream.findMany({
            where:{
                streamId:{
                    in:streamIds
                }
            }
        });

        return reply.status(200).send(streams);
    } catch (error) {
        console.log(error);
        return reply.status(500).send(error);
    }
}

export async function getMyDislikedStreams(request: FastifyRequest<{ Querystring: PaginationQuery }>, reply: FastifyReply) {
    try {
        const votes = await prisma.vote.findMany({
            take: request.query.limit,
            skip: request.query.limit * (request.query.page),
            where:{
                userUserId:request.user.userId,
                dislike:true
            },
            select: {
                streamStreamId:true
            }
        })
        
        const streamIds = votes.map(stream => stream.streamStreamId);
        const streams = await prisma.stream.findMany({
            where:{
                streamId:{
                    in:streamIds
                }
            }
        });

        return reply.status(200).send(streams);
    } catch (error) {
        console.log(error);
        return reply.status(500).send(error);
    }
}