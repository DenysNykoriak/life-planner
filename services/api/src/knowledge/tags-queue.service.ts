import { Injectable, Logger } from "@nestjs/common";

type Job = () => Promise<void>;
type QueueItem = { id: string; job: Job };

@Injectable()
export class TagsQueueService {
	private readonly logger = new Logger(TagsQueueService.name);
	private readonly queue: QueueItem[] = [];
	private currentId: string | null = null;
	private running = false;

	enqueue(id: string, job: Job): void {
		this.queue.push({ id, job });
		void this.drain();
	}

	getQueuedIds(): string[] {
		const ids: string[] = [];
		if (this.currentId) ids.push(this.currentId);
		ids.push(...this.queue.map((item) => item.id));
		return ids;
	}

	private async drain(): Promise<void> {
		if (this.running) return;
		this.running = true;
		while (this.queue.length > 0) {
			const item = this.queue.shift()!;
			this.currentId = item.id;
			try {
				await item.job();
			} catch (err) {
				this.logger.error("Tags job failed", err);
			}
		}
		this.currentId = null;
		this.running = false;
	}
}
