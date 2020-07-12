const users = [];
const records = [
  {
    id: 1,
    createdOn: '7/1/2020, 4:40:52 PM',
    authorId: 1,
    authorName: 'Brian Gitego',
    title: 'Corruption somewhere one',
    type: 'intervention',
    description:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Velit sit modi hic dolore autem, illum suscipit voluptas laborum praesentium architecto, accusantium ipsum quos uod recusandae repudiandae, quidem debitis nihil magni? Lorem ipsum dolor sit ametonsectetur adipisicing elit. Voluptatem vel perspiciatis modi earum tenetur id atque eos. Reprehenderit beatae cupiditate delectus? Quidem possimus eos quo, error beatae tempore porro rem. Lorem ipsum dolor sit amet, onsectetur adipisicing elit. Labore aliquid pariatur, maxime libero deleniti aperiam! Cupiditate repellendus amet, ratione inventore ab, voluptate ad delectus, eos quaerat modi quis quam est. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Velit sit modi  hic dolore autem, illum suscipit voluptas laborum praesentium architecto, accusantium ipsum quos quod recusandae repudiandae, quidem debitis nihil magni? Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem vel perspiciatis modi earum tenetur id atque eos. Reprehenderit beatae cupiditat eelectus? Quidem possimus eos quo, error beatae tempore porro rem. Lorem ipsum dolor sit amet',
    district: 'Kicukiro',
    sector: 'niboye',
    cell: 'gatare',
    status: 'Pending',
    media: [],
  },
  {
    id: 2,
    createdOn: '7/1/2020, 4:40:52 PM',
    authorId: 1,
    authorName: 'Ben Gisa',
    title: 'Corruption somewhere two',
    type: 'intervention',
    description:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Velit sit modi hic dolore autem, illum suscipit voluptas laborum praesentium architecto, accusantium ipsum quos uod recusandae repudiandae, quidem debitis nihil magni? Lorem ipsum dolor sit ametonsectetur adipisicing elit. Voluptatem vel perspiciatis modi earum tenetur id atque eos. Reprehenderit beatae cupiditate delectus? Quidem possimus eos quo, error beatae tempore porro rem. Lorem ipsum dolor sit amet, onsectetur adipisicing elit. Labore aliquid pariatur, maxime libero deleniti aperiam! Cupiditate repellendus amet, ratione inventore ab, voluptate ad delectus, eos quaerat modi quis quam est. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Velit sit modi  hic dolore autem, illum suscipit voluptas laborum praesentium architecto, accusantium ipsum quos quod recusandae repudiandae, quidem debitis nihil magni? Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem vel perspiciatis modi earum tenetur id atque eos. Reprehenderit beatae cupiditat eelectus? Quidem possimus eos quo, error beatae tempore porro rem. Lorem ipsum dolor sit amet',
    district: 'Kicukiro',
    sector: 'niboye',
    cell: 'gatare',
    status: 'Resolved',
    media: [],
  },
  {
    id: 3,
    createdOn: '7/1/2020, 4:40:52 PM',
    authorId: 1,
    authorName: 'Bruce Sangwa',
    title: 'Corruption somewhere three',
    type: 'intervention',
    description:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Velit sit modi hic dolore autem, illum suscipit voluptas laborum praesentium architecto, accusantium ipsum quos uod recusandae repudiandae, quidem debitis nihil magni? Lorem ipsum dolor sit ametonsectetur adipisicing elit. Voluptatem vel perspiciatis modi earum tenetur id atque eos. Reprehenderit beatae cupiditate delectus? Quidem possimus eos quo, error beatae tempore porro rem. Lorem ipsum dolor sit amet, onsectetur adipisicing elit. Labore aliquid pariatur, maxime libero deleniti aperiam! Cupiditate repellendus amet, ratione inventore ab, voluptate ad delectus, eos quaerat modi quis quam est. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Velit sit modi  hic dolore autem, illum suscipit voluptas laborum praesentium architecto, accusantium ipsum quos quod recusandae repudiandae, quidem debitis nihil magni? Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem vel perspiciatis modi earum tenetur id atque eos. Reprehenderit beatae cupiditat eelectus? Quidem possimus eos quo, error beatae tempore porro rem. Lorem ipsum dolor sit amet',
    district: 'Kicukiro',
    sector: 'niboye',
    cell: 'gatare',
    status: 'Rejected',
    media: [],
  },
  {
    id: 4,
    createdOn: '7/1/2020, 4:40:52 PM',
    authorId: 1,
    authorName: 'Brian Gitego',
    title: 'Corruption somewhere four',
    type: 'intervention',
    description:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Velit sit modi hic dolore autem, illum suscipit voluptas laborum praesentium architecto, accusantium ipsum quos uod recusandae repudiandae, quidem debitis nihil magni? Lorem ipsum dolor sit ametonsectetur adipisicing elit. Voluptatem vel perspiciatis modi earum tenetur id atque eos. Reprehenderit beatae cupiditate delectus? Quidem possimus eos quo, error beatae tempore porro rem. Lorem ipsum dolor sit amet, onsectetur adipisicing elit. Labore aliquid pariatur, maxime libero deleniti aperiam! Cupiditate repellendus amet, ratione inventore ab, voluptate ad delectus, eos quaerat modi quis quam est. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Velit sit modi  hic dolore autem, illum suscipit voluptas laborum praesentium architecto, accusantium ipsum quos quod recusandae repudiandae, quidem debitis nihil magni? Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem vel perspiciatis modi earum tenetur id atque eos. Reprehenderit beatae cupiditat eelectus? Quidem possimus eos quo, error beatae tempore porro rem. Lorem ipsum dolor sit amet',
    district: 'Kicukiro',
    sector: 'niboye',
    cell: 'gatare',
    status: 'Resolved',
    media: [],
  },
];

export { users, records };
