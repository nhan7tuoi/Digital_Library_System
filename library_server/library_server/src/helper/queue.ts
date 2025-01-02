import { env } from "./index";
import { ConnectionOptions, Job, Queue, Worker } from "bullmq";
import { EmailProccessor } from "./processor/email.processor";


const connectionOptions: ConnectionOptions = {
  host: env.REDIS_HOST,
  port: parseInt(env.REDIS_PORT),
};

export class CustomQueue {
  queue: Queue;
  worker: Worker;
  queueName: string;
  constructor(
    queueName: string,
    processor: (job: Job) => Promise<void>,
    connectionOpts: ConnectionOptions = connectionOptions
  ) {
    this.queueName = queueName;
    this.queue = new Queue(queueName, { connection: connectionOpts });
    this.worker = new Worker(
      queueName,
      async (job: Job) => {
        try {
          await processor(job);
        } catch (error) {
          console.error(`Error processing job ${job.id}:`, error);
          throw error;
        }
      },
      { connection: connectionOpts, concurrency: 1 }
    );
    this.worker.on("failed", (job, err) => {
      console.error(`Job failed with id ${job.id}: ${err.message}`);
    });
  }
  async addJob(data: Record<string, any>) {
    await this.queue.add(this.queueName, data);
  }
}

export const Queues = {
  emailQueue: new CustomQueue("emailQueue", EmailProccessor.emailProcessor),

};
