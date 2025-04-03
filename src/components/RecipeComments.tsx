@@ -0,0 +1,140 @@
 
 import { useState } from "react";
 import { Comment } from "@/types/recipe";
 import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import { Textarea } from "@/components/ui/textarea";
 import { Separator } from "@/components/ui/separator";
 import { Star } from "lucide-react";
 
 interface RecipeCommentsProps {
   comments: Comment[];
   onAddComment: (text: string, rating: number) => Promise<void>;
 }
 
 export const RecipeComments = ({ comments, onAddComment }: RecipeCommentsProps) => {
   const [text, setText] = useState("");
   const [rating, setRating] = useState(0);
   const [hoverRating, setHoverRating] = useState(0);
   const [isSubmitting, setIsSubmitting] = useState(false);
 
   const handleAddComment = async () => {
     if (!text.trim() || rating === 0) return;
     
     setIsSubmitting(true);
     try {
       await onAddComment(text, rating);
       setText("");
       setRating(0);
     } catch (error) {
       console.error("Failed to add comment:", error);
     } finally {
       setIsSubmitting(false);
     }
   };
 
   const StarRating = ({ value, onSelect, onHover, onLeave }: { 
     value: number; 
     onSelect: (rating: number) => void;
     onHover?: (rating: number) => void;
     onLeave?: () => void;
   }) => {
     return (
       <div className="flex space-x-1" 
         onMouseLeave={onLeave ? () => onLeave() : undefined}>
         {[1, 2, 3, 4, 5].map((star) => (
           <button
             key={star}
             type="button"
             onClick={() => onSelect(star)}
             onMouseEnter={onHover ? () => onHover(star) : undefined}
             className="focus:outline-none"
             aria-label={`Rate ${star} out of 5 stars`}
           >
             <Star 
               className={`h-6 w-6 transition-colors ${
                 star <= (onHover && hoverRating ? hoverRating : value)
                   ? "fill-yellow-400 text-yellow-400"
                   : "text-gray-300"
               }`}
             />
           </button>
         ))}
       </div>
     );
   };
 
   const formatDate = (timestamp: number) => {
     return new Date(timestamp).toLocaleDateString('pt-BR', {
       year: 'numeric',
       month: 'long',
       day: 'numeric'
     });
   };
 
   return (
     <div className="space-y-4">
       <Card>
         <CardHeader>
           <CardTitle>Deixe seu comentário</CardTitle>
         </CardHeader>
         <CardContent className="space-y-4">
           <div className="space-y-2">
             <div className="flex items-center space-x-2">
               <label htmlFor="rating" className="text-sm font-medium">Avaliação:</label>
               <StarRating 
                 value={rating} 
                 onSelect={setRating} 
                 onHover={setHoverRating} 
                 onLeave={() => setHoverRating(0)} 
               />
               <span className="ml-2 text-sm">
                 {rating > 0 ? `${rating}/5` : ""}
               </span>
             </div>
             <Textarea
               id="comment"
               value={text}
               onChange={(e) => setText(e.target.value)}
               placeholder="Compartilhe sua experiência com esta receita..."
               className="min-h-[100px]"
             />
           </div>
         </CardContent>
         <CardFooter>
           <Button 
             onClick={handleAddComment} 
             disabled={!text.trim() || rating === 0 || isSubmitting}
           >
             {isSubmitting ? "Enviando..." : "Enviar Comentário"}
           </Button>
         </CardFooter>
       </Card>
       
       {comments.length > 0 ? (
         <div className="space-y-4">
           <h3 className="font-semibold text-lg">Comentários ({comments.length})</h3>
           {comments.map((comment) => (
             <Card key={comment.id} className="bg-muted/40">
               <CardContent className="pt-4">
                 <div className="flex justify-between items-center mb-2">
                   <StarRating value={comment.rating} onSelect={() => {}} />
                   <span className="text-xs text-muted-foreground">
                     {formatDate(comment.createdAt)}
                   </span>
                 </div>
                 <p className="text-sm">{comment.text}</p>
               </CardContent>
             </Card>
           ))}
         </div>
       ) : (
         <div className="text-center py-6 text-muted-foreground">
           <p>Seja o primeiro a avaliar esta receita!</p>
         </div>
       )}
     </div>
   );
 };
 
 export default RecipeComments;