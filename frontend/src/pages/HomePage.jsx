import { useAuthStore } from "../store/authStore";
import { formatDate } from "../utils/formatDate";
import { motion } from "framer-motion";
import { Pencil } from "lucide-react";
import { useState } from "react";

const HomePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const { user, logout, updateProfile } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  const handleSave = async () => {
    await updateProfile(editedData.name);
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full mx-auto mt-10 p-8 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800"
    >
      <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text">
        Dashboard
      </h2>

      {isEditing ? (
        <div className="mt-3 text-white">
          <p className="my-2 w-full justify-between flex items-center gap-2">
            Você está no modo de edição. <Pencil size={16} />
          </p>
          <span className="text-white opacity-60 text-sm">
            No momento só é possível editar o nome de usuário.
          </span>

          <div className="bg-white h-[1px] opacity-50" />

          <div className="mt-10 flex items-center gap-2">
            <label className="flex 1">Nome de usuário</label>
            <input
              type="text"
              value={editedData.name ?? user.name}
              onChange={(e) =>
                setEditedData({ ...editedData, name: e.target.value })
              }
              className="text-lg flex-1 mb-2 pl-2 bg-[#0F2539] w-full border border-white rounded-md"
            />
          </div>

          <motion.div
            className="flex items-center gap-5 mt-3 bg-gray-800 bg-opacity-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSave()}
              className="w-full py-3 px-4 text-white rounded-lg bg-gradient-to-r from-green-600 to-green-700"
            >
              Salvar dados
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(false)}
              className="w-full py-3 px-4 text-white rounded-lg bg-gradient-to-r from-red-400 to-red-500"
            >
              Cancelar edição
            </motion.button>
          </motion.div>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            <motion.div
              className="p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-semibold text-green-400 mb-3">
                Informação do usuário
              </h3>
              <p className="text-gray-300">Nome: {user.name}</p>
              <p className="text-gray-300">Email: {user.email}</p>
            </motion.div>
            <motion.div
              className="p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-xl font-semibold text-green-400 mb-3">
                Atividade da conta
              </h3>
              <p className="text-gray-300">
                <span className="font-bold">Conta criada: </span>
                {new Date(user.createdAt).toLocaleDateString("pt-BR", {
                  year: "numeric",
                  month: "2-digit",
                  day: "numeric",
                })}
              </p>
              <p className="text-gray-300">
                <span className="font-bold">Último login: </span>

                {formatDate(user.lastLogin)}
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex gap-5 mt-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(true)}
              className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
				font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700
				 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Editar
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
				font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700
				 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Sair da conta
            </motion.button>
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default HomePage;
