import type { Message } from '../../../config/store/slices/chatSlices';
import UserAvatar from '../media/user.svg';
import AiAvatar from '../media/robot.jpg';

type MessageBubbleProps = {
  message: Message;
};

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isHumain = message.role === 'user';
  const { content } = message;

  return (
    <div className={`flex ${isHumain ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className="flex items-start gap-2.5">
        <img
          src={isHumain ? UserAvatar : AiAvatar}
          className="w-8 h-8 rounded-full"
          alt="Avatar image"
        />
        <div
          className={`flex flex-col w-full ${
            isHumain ? 'max-w-[350px]' : 'max-w-[700px]'
          } leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700`}
        >
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {isHumain ? 'Moi' : 'AI'}
            </span>
          </div>

          <p className="whitespace-pre-wrap text-sm font-normal py-0.5 text-gray-900 dark:text-white">
            {content}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
